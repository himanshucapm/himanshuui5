sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"zstatnryrequest/utils/Formatter"
], function (Controller, MessageToast, MessageBox, JSONModel,Formatter) {
"use strict";
var Empcode, btcd, RequestJModel, historyJModel, statusJModel, that, index ,AvailableStock,Matnr,Username,Persa,ReqNo;
	
return Controller.extend("zstatnryrequest.controller.View1", {
	onInit: function () {
			that = this;
			
			statusJModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(statusJModel,"statusJModel");
			
			RequestJModel = new sap.ui.model.json.JSONModel();
			this.getView().byId("idStationaryRequest").setModel(RequestJModel, "RequestJModel");

			historyJModel = new sap.ui.model.json.JSONModel();
			this.getView().byId("idRequestHistory").setModel(historyJModel, "historyJModel");
			
			var datum = new Date();
			var time = datum.toLocaleTimeString();
			datum = datum.toString();
			datum = datum.substr(0,16);
			this.getView().byId("idDate").setText(datum).addStyleClass("textBold");
			
			 // example usage: realtime clock
			 setInterval(function(){
			     var   currentTime = that.getDateTime();
			       that.getView().byId("idTime").setText(currentTime);
			    }, 1000);
			
			this.getStatusData();
			this.getUserInfo();
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
		getStatusData:function(){
			debugger
			
			var that= this;
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/"; 
			var sPath = "/GetStatusSet";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			var oData = {};
						oData.success = function(oData,oResponse){
							debugger
							statusJModel.setData(oData.results);
						};
						oData.error = function(oError){
							debugger
						};
			oDataModel.read(sPath, oData);
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		getUserInfo:function(){
			debugger
			var that= this;
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/"; 
			var sPath = "/GetEmpDetailSet(Username='"+sap.ushell.Container.getService("UserInfo").getId()+"')";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			var oData = {};
						oData.success = function(oData,oResponse){
							debugger
							that.getView().byId("idName").setText(oData.Ename).addStyleClass("textBold");
							that.getView().byId("idLocation").setText(oData.Name1).addStyleClass("textBold");
						//	that.getView().byId("idEmpCode").setText(oData.Empcode).addStyleClass("textBold");
							Empcode = oData.Empcode;
							Username= oData.Username;
							Persa = oData.Persa;
							btcd = oData.btcd;
							
							that.getUserHistory();
						};
						oData.error = function(oError){
							debugger 
						};
			oDataModel.read(sPath, oData);
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	getUserHistory:function(){
		debugger
		var that = this;
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
		var sPath ="/StockReqItemSet?$filter=Pernr eq '"+Empcode+"'";
		
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
		var oData = {};
					oData.success = function(oData,oResponse){
						debugger;
						historyJModel.setData(oData.results);
					//	ReqNo = oData.results.ReqNo
					};
					oData.error = function(oError){
						debugger
					};
		oDataModel.read(sPath, oData);
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
		addNewItem: function () {
			debugger
			var that = this;
			var data = {};
			var stationaryData;
			var stationaryTable = this.getView().byId("idStationaryRequest");
			
			if(stationaryTable.getItems().length < '1')
				stationaryData = [];
			else
				stationaryData = stationaryTable.getModel("RequestJModel").getData();
			
			data.Matnr		= "";
			data.ReqMenge	= "";
			data.Remark		= "";
			data.Pernr		= Empcode;
			data.Persa		= Persa;
			
			stationaryData.push(data);
			stationaryTable.getModel("RequestJModel").setData(stationaryData);
			stationaryTable.getModel("RequestJModel").refresh();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onRemoveRow: function (evt) {
			debugger
			var statnryTble = this.getView().byId("idStationaryRequest");
			var path = evt.getSource().getParent().oBindingContexts.RequestJModel.sPath.split('/')[1];
			if(	path !== -1){
				statnryTble.getModel("RequestJModel").getData().splice(path,1);
				statnryTble.getModel("RequestJModel").refresh();
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onItemHelp: function (evt) {
			debugger
			this.ItemPath = evt.getSource();
			var posPath = this.ItemPath.getParent().getParent().getItems().indexOf(this.ItemPath.getParent());
			var sPath  = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/F4ItemSet";
			var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
			var _valueHelpItemSelectDialog = new sap.m.SelectDialog({
						title : "Select Item",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem({
								title : "{Maktx}",
							//	description: "{Maktx}",
								customData : [ new sap.ui.core.CustomData({
									key : "{Matnr}",
									value : "{Maktx}"
								})],
							}),
						},
						
				liveChange : function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
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
				var that = this;
				
				var posPath = this.ItemPath.getParent().getParent().getItems().indexOf(this.ItemPath.getParent());
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
						var obj = oSelectedItem.getBindingContext().getObject();
						Matnr=obj.Matnr;
						this.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[1].setText(Matnr);

						var item = obj.Item;
						this.ItemPath.setValue(oSelectedItem.getTitle());
						
						/*
						var sServiceUrlsetPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/"; 
						var sPath = "/StockReqItemSet(Pernr='"+Empcode+"',Persa='"+Persa+"',Matnr='"+Matnr+"')";
				 
						var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
						var oData = {};
									oData.success = function(oData,oResponse){
										debugger
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[2].setValue(oData.AvaMenge);
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[3].setEnabled(true);
									};
									oData.error = function(oError){
										debugger
									};
						oDataModel.read(sPath, oData);
						*/
				}
				this.checkItems(posPath, oSelectedItem.getBindingContext().getObject().Matnr);
		},
		
		checkItems:function(posPath , Matnr){
			debugger
			var rows = this.getView().byId("idStationaryRequest").getItems();

			for(var i = 0 ; i < rows.length ; i++){ 
				if(i != posPath && this.getView().byId("idStationaryRequest").getItems()[i].getCells()[1].getText() == Matnr){
					sap.m.MessageToast.show("Item already selected.");
					this.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[0].setValue();
					this.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[1].setText();
					this.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[2].setValue();
					this.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[4].setValue().setEnabled(false);
					return false;
				}else{
					var sServiceUrlsetPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/"; 
					var sPath = "/StockReqItemSet(Pernr='"+Empcode+"',Persa='"+Persa+"',Matnr='"+Matnr+"')";
			 
					var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
					var oData = {};
								oData.success = function(oData,oResponse){
									debugger
									if(that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[1].getText() != ""){
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[2].setText(oData.AvaMenge);
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[3].setText(oData.ReqMenge);
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[4].setEnabled(true);
									}
									if(parseInt(oData.AvaMenge) == "0" || oData.AvaMenge == ""){
										sap.m.MessageToast.show("Item Not in Stock")
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[0].setValue();
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[2].setValue();	
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[3].setText();
										that.getView().byId("idStationaryRequest").getItems()[posPath].getCells()[4].setEnabled(false);
										}
									};
								oData.error = function(oError){
									debugger
								};
					oDataModel.read(sPath, oData);
				}
			}
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		handleIconTabBarSelect : function(){
			debugger
			var view = this;
			var tabBar = view.getView().byId("iconTabBar").getSelectedKey();
			if (tabBar == "A"){
				this.getView().byId("idSubmit").setVisible(true);
			}else if (tabBar == "B"){
				this.getUserHistory();
				this.getView().byId("idSubmit").setVisible(false);
			}
		},
		
		onQtyValid: function (oEvent){
			debugger
			var Val = oEvent.getSource().getValue();
			if(Val){
				if(isNaN(Val)){
					Val = Val.substring(0, Val.length-1);
					oEvent.getSource().setValue(Val);
				}else if(Val.indexOf(".")!= "-1"){
					Val = Val.substring(0, Val.length-1);
					oEvent.getSource().setValue(Val);
				}
			}
		},
		
		onQuantitychange:function(oEvent){
			debugger
			var index = oEvent.getSource().getParent().getBindingContext("RequestJModel").sPath.split("/")[1];
			var data  = this.getView().byId("idStationaryRequest").getItems()[index];
			var AvlStock = parseInt(data.getCells()[2].getText());
			var qty 	 = parseInt(data.getCells()[4].getValue()); 
			if(AvlStock < qty){
					sap.m.MessageToast.show("Item does not has no stock");
					data.getCells()[4].setValueState("Error").setValue();
					return false;
				}else{
					data.getCells()[4].setValueState("None");
				}
		},
	
			
//////////////////////////////////////////////////////////////////////////////////////////////////
			onSubmit: function (){
			debugger
			
			var errorFlag = false;
			var tableItems = this.getView().byId("idStationaryRequest").getItems();
			
			if(tableItems.length < 1){
			sap.m.MessageToast.show("Please input at least one item.");
			return false;
			}
			
			for(var i = 0 ; i < tableItems.length ; i++ ){
			tableItems[i].getCells()[0].setValueState("None");
			tableItems[i].getCells()[4].setValueState("None");
			
			if(tableItems[i].getCells()[0].getValue() == ""){
			errorFlag = true;
			tableItems[i].getCells()[0].setValueState("Error");
			}
			if(tableItems[i].getCells()[4].getValue() == ""){
			errorFlag = true;
			tableItems[i].getCells()[4].setValueState("Error");
			}
			
			}
			if(errorFlag == true){
			sap.m.MessageToast.show("Please enter Item and Quantity.");
			return false;
			}
			
			var Data = {};
			Data.Pernr = Empcode;

		    Data.StockReqNvg = RequestJModel.getData();
			
			var sServiceUrl = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
			var sPath = "/StockReqHdrSet";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});
			var fncSuccess = function(oData, oResponse)
			{
			if(oData.EError=="true"){
			sap.m.MessageBox.show(oData.EMessage, {
			title: "Error",
			icon:sap.m.MessageBox.Icon.ERROR,
			onClose:function(){
			}
			});
			}else{
			sap.m.MessageBox.show("Submitted Successfully.", {
			title: "Success",
			icon:sap.m.MessageBox.Icon.SUCCESS,
			onClose:function(){
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
			target: { semanticObject : "#"}
			});
			}
			});
			}
			}
			var fncError = function(oError) {
			var parser = new DOMParser();
			sap.m.MessageBox.show(parser, {
			title: "Error",
			icon:sap.m.MessageBox.Icon.ERROR,
			});
			}
			//Create Method for final Save
			oCreateModel1.create(sPath, Data, {
			success: fncSuccess,
			error: fncError
			});
			
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
//////////////////////////////Open a fragment in a table//////////////////
		onItems: function (oEvent){
			debugger
			var that = this;
			this._RequestItemHelpDialog = sap.ui.xmlfragment("zstatnryrequest.view.RequestItem", this);
			this._RequestItemHelpDialog.open();
		},
///////////////////////////on Fragment Cancel/////////////////////////////
		onRequestCancel: function (){
			debugger
			this._RequestItemHelpDialog.close();
			this._RequestItemHelpDialog.destroy();
		},
	});
});