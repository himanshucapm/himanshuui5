sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"ZAddStationary/util/Formatter"
], function (Controller, MessageToast, MessageBox, JSONModel) {
/*"use strict";*/

var Username, Empcode, Ename, Persa, Name1;
var itemJModel, HistoryJModel;
var originalItemCount;
var that;

return Controller.extend("ZAddStationary.controller.View1", {
	
onInit: function () {
			that = this;

			itemJModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(itemJModel, "itemJModel");
			
			HistoryJModel = new sap.ui.model.json.JSONModel();
			
			var datum = new Date();
			var time = datum.toLocaleTimeString();
			datum = datum.toString();
		// idTime	datum = datum.substr(0,16) + " " +time;
			datum = datum.substr(0,16);
			this.getView().byId("idDate").setText(datum).addStyleClass("textBold1");
		
			 // example usage: realtime clock
		    setInterval(function(){
		      var  currentTime = that.getDateTime();
		       that.getView().byId("idTime").setText(currentTime);
		    }, 1000);
		    
				this.getUserInfo();
			// onAfterRendering for the item table
			var table = this.getView().byId("ItemTable");
			table.addEventDelegate({
				onAfterRendering: function(){
					var rows = that.getView().byId("ItemTable").getItems();
					for(var i = 0 ; i < rows.length ; i++){
						rows[i].getCells()[0].setText(i+1);
					}
				}
			},table);
			
			this.getView().byId("idName").addStyleClass("textBold");
			this.getView().byId("idLocation").addStyleClass("textBold");
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
	onLiveQty:function(oEvent){
		debugger
		var text = oEvent.getSource().getValue();
		var code = text.charCodeAt(text.length-1);
							 
			if( text.length > 0 ){
					if ( !(code > 47 && code < 58)) 
						{
						text = text.substring( 0 , text.length - 1 );
						}
			}
		oEvent.getSource().setValue(text);
	},
	
	getUserInfo:function(){
		debugger
		var that= this;
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/"; 
		var sPath = "/GetEmpDetailSet(Username='"+sap.ushell.Container.getService("UserInfo").getId()+"')";
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
		var oData = {};
					oData.success = function(oData,oResponse){
						debugger
						Name1 = oData.Name1;
						Ename = oData.Ename;
						Empcode = oData.Empcode;
						Persa = oData.Persa;
						
						that.getView().byId("idName").setText(Ename);
						that.getView().byId("idLocation").setText(Name1);
						
						that.getStock();
					};
					oData.error = function(oError){
						debugger
					};
		oDataModel.read(sPath, oData);
	},
	
	getStock:function(){
		debugger
		//var that= this;
		var sService = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/"; 
		var sPath = "/StockHeadSet?$filter=Persa eq '"+Persa+"'&$expand=StockHeadToItemNvg";
		var oDataModel = new sap.ui.model.odata.ODataModel(sService);
		var oData = {};
					oData.success = function(oData,oResponse){
						debugger
						delete oData.__metadata;
						var itemTable = that.getView().byId("ItemTable");
						
						originalItemCount = oData.results.length;
						
						itemTable.getModel("itemJModel").setData(oData.results);
						itemJModel.refresh();
					
						for(var i=0 ; i<originalItemCount ; i++){
							itemTable.getItems()[i].getCells()[7].getItems()[0].setVisible(true);
						}
					};
					oData.error = function(oError){
						debugger
					};
		oDataModel.read(sPath, oData);
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
							/*description: "{Maktx}",*/
							customData : [ new sap.ui.core.CustomData({
								key : "Matnr",
								value : "{Maktx}"
							})],
						}),
					},
					
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
				//var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
				//var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
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

					var Matnr = obj.Matnr;
					var Maktx = obj.Maktx;
					this.ItemPath.setValue(Maktx);
					this.getView().byId("ItemTable").getItems()[posPath].getCells()[1].setValue(Matnr);
			}
			
			this.checkItems(posPath, oSelectedItem.getBindingContext().getObject().Matnr);
			
	},

	checkItems:function(posPath , Matnr){
		debugger
		var rows = this.getView().byId("ItemTable").getItems();

		for(var i = 0 ; i < rows.length ; i++){
			if(i != posPath && this.getView().byId("ItemTable").getItems()[i].getCells()[1].getValue() == Matnr){
				sap.m.MessageToast.show("Item already selected.");
				this.getView().byId("ItemTable").getItems()[posPath].getCells()[1].setValue();
				this.getView().byId("ItemTable").getItems()[posPath].getCells()[2].setValue();
				return false;
			}
		}
	
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onAddItem: function () {
		debugger
		var that = this;
		var data = {};
		var stationaryData;
		var itemTable = this.getView().byId("ItemTable");
		
		if(itemTable.getItems().length < '1')
			stationaryData = [];
		else
			stationaryData = itemTable.getModel("itemJModel").getData();
		
		data.Matnr		= "";
		data.Maktx		= "";
		data.AvaMenge	= "0";
		data.Aedat		= "";
		data.Aezet		= "";
		data.LstMenge	= "0";
		data.Menge		= "";
		data.Flag		= "2";
		data.Persa		= Persa;
		
		stationaryData.push(data);
		itemTable.getModel("itemJModel").setData(stationaryData);
		itemTable.getModel("itemJModel").refresh();
		
		var idx = itemTable.getModel("itemJModel").getData().length;

			if( idx > originalItemCount ){
				that.getView().byId("ItemTable").getItems()[idx-1].getCells()[7].getItems()[2].setVisible(true);
				that.getView().byId("ItemTable").getItems()[idx-1].getCells()[2].setEnabled(true);
				that.getView().byId("ItemTable").getItems()[idx-1].getCells()[6].setEnabled(true);
			}else
				that.getView().byId("ItemTable").getItems()[idx-1].getCells()[7].getItems()[0].setVisible(true);
		
	},
	
	onDeleteNewRow: function (evt) {
		debugger
		var statnryTble = this.getView().byId("ItemTable");
		var path = evt.getSource().getParent().getParent().getParent().getBindingContextPath().split('/')[1];
			
		statnryTble.getModel("itemJModel").getData().splice(path,1);
		statnryTble.getModel("itemJModel").refresh();
		
		for(var i=0 ; i<itemJModel.getData().length ; i++){
			if(itemJModel.getData()[path].Flag == "0"){
				statnryTble.getItems()[path].getCells()[7].getItems()[0].setVisible(true);
				statnryTble.getItems()[path].getCells()[7].getItems()[1].setVisible(false);
				statnryTble.getItems()[path].getCells()[7].getItems()[2].setVisible(false);
			}else if(itemJModel.getData()[path].Flag == "1"){
				statnryTble.getItems()[path].getCells()[7].getItems()[0].setVisible(false);
				statnryTble.getItems()[path].getCells()[7].getItems()[1].setVisible(true);
				statnryTble.getItems()[path].getCells()[7].getItems()[2].setVisible(false);
			}else{
				statnryTble.getItems()[path].getCells()[7].getItems()[0].setVisible(false);
				statnryTble.getItems()[path].getCells()[7].getItems()[1].setVisible(false);
				statnryTble.getItems()[path].getCells()[7].getItems()[2].setVisible(true);
			}
		}
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
	onHistory:function(oEvent){
		debugger
		that = this;
		
		var path = oEvent.getSource().getParent().getParent().getParent().getBindingContextPath().split('/')[1];
		
		if(itemJModel.getData()[path].StockHeadToItemNvg == undefined){
			sap.m.MessageToast.show("No History Available");
			return false;
		}
		
		HistoryJModel.setData( itemJModel.getData()[path].StockHeadToItemNvg.results);
		
		if (!that._HistoryDialog) {
			that._HistoryDialog = sap.ui.xmlfragment("ZAddStationary.view.RequestItem", that);
			that.getView().addDependent(that._HistoryDialog);
		}
		that._HistoryDialog.open();
		
		sap.ui.getCore().byId("historyDialog").setModel(HistoryJModel, "HistoryJModel");
		sap.ui.getCore().byId("historyDialog").setTitle("Item ( "+itemJModel.getData()[path].Maktx+" ) ");
		HistoryJModel.refresh();
	},
	
	onRequestClose: function (){
		debugger
		that._HistoryDialog.close();
		//that._HistoryDialog.destroy();
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onEdit:function(oEvent){
		debugger
		oEvent.getSource().getParent().getParent().getItems()[0].setVisible(false);
		oEvent.getSource().getParent().getParent().getItems()[1].setVisible(true);
		oEvent.getSource().getParent().getParent().getParent().getCells()[6].setEnabled(true);
		oEvent.getSource().getParent().getParent().getParent().getCells()[9].setText("1");
	},
	
	onCancel:function(oEvent){
		debugger
		oEvent.getSource().getParent().getParent().getItems()[0].setVisible(true);
		oEvent.getSource().getParent().getParent().getItems()[1].setVisible(false);
		oEvent.getSource().getParent().getParent().getParent().getCells()[6].setEnabled(false).setValueState("None");
		oEvent.getSource().getParent().getParent().getParent().getCells()[9].setText("0");
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
//////////////////////////////////////////////////////////////////////////////////////////////////
		onUpdate: function (oEvent){
			debugger
			var errorFlag  = false;
			var itemTable = this.getView().byId("ItemTable");
			
			var path = oEvent.getSource().getParent().getParent().getParent().getBindingContextPath().split('/')[1];
			
			var matnr = this.getView().byId("ItemTable").getItems()[path].getCells()[1];
			var item = this.getView().byId("ItemTable").getItems()[path].getCells()[2];
			var qty = this.getView().byId("ItemTable").getItems()[path].getCells()[6];
			
			item.setValueState("None");
			qty.setValueState("None");
				
				if( item.getValue() == "" || matnr.getValue() == ""){
					errorFlag = true;
					item.setValueState("Error");
				}
				
				if( qty.getValue() == "" || parseInt(qty.getValue()) == "0"){
					errorFlag = true;
					qty.setValueState("Error");
				}
				
				if(errorFlag == true){
					sap.m.MessageToast.show("Item & Quantity is required for updation.");
					return false;
				}
				
			var data = {};
			data.Persa	= Persa;
			data.Matnr	= itemTable.getItems()[path].getCells()[1].getValue();
			data.Maktx	= itemTable.getItems()[path].getCells()[2].getValue();
			data.Menge	= itemTable.getItems()[path].getCells()[6].getValue();
			
			var sServiceUrl = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/";
			var sPath = "StockHeadSet";
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
							/*var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
							oCrossAppNavigator.toExternal({
								target: { semanticObject : "#"}
							});*/
							
							//that.getStock();
						}
					});
					
					//Item 
					itemTable.getItems()[path].getCells()[2].setEnabled(false);
					
					//Available Quantity
					//itemTable.getItems()[path].getCells()[3].setText( parseInt( itemTable.getItems()[path].getCells()[3].getText() ) + parseInt( itemTable.getItems()[path].getCells()[6].getValue() ) ) ;
					itemTable.getItems()[path].getCells()[3].setText( oResponse.data.AvaMenge );
					
					//Update Date & Time
					/*
					var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern : "dd-MM-yyyy"});
					var sDate = new Date();
					var b = oDateFormat.format(sDate); 
					var c = sDate.toLocaleTimeString();
					*/

					itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[0].setText(oResponse.data.TimeStamp);
					//itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[2].setText(c);
					
					
					//Last Refill Qty
					//itemTable.getItems()[path].getCells()[4].setText(itemTable.getItems()[path].getCells()[6].getValue());
					itemTable.getItems()[path].getCells()[4].setText(oResponse.data.LstMenge);
					
					//Reset the Refill Qty
					itemTable.getItems()[path].getCells()[6].setValue("0").setEnabled(false);

					//Action Button
					itemTable.getItems()[path].getCells()[7].getItems()[0].setVisible(true);
					itemTable.getItems()[path].getCells()[7].getItems()[1].setVisible(false);
					itemTable.getItems()[path].getCells()[7].getItems()[2].setVisible(false);
					
					itemTable.getItems()[path].getCells()[9].setText("0");
					
					if(itemJModel.getData()[path].StockHeadToItemNvg == undefined || itemJModel.getData()[path].StockHeadToItemNvg.results == undefined){
							itemJModel.getData()[path].StockHeadToItemNvg = {};
							itemJModel.getData()[path].StockHeadToItemNvg.results = [];
						
							itemJModel.getData()[path].StockHeadToItemNvg.results.push(
														{
															"Menge":itemTable.getItems()[path].getCells()[4].getText(),
															"TimeStamp":itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[0].getText()
															/*"Erdat":itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[0].getText(),
															"Erzet":itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[2].getText()*/
														}
													)
						}else{
						
							itemJModel.getData()[path].StockHeadToItemNvg.results.push(
														{
															"Menge":itemTable.getItems()[path].getCells()[4].getText(),
															"TimeStamp":itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[0].getText()
															/*"Erdat":itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[0].getText(),
															"Erzet":itemTable.getItems()[path].getCells()[5].getItems()[0].getItems()[2].getText()*/
														}
													)
						}
					
					}
			}
			var fncError = function(oError) {
				var parser = new DOMParser();
				sap.m.MessageBox.show(parser, {
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
				});
				//that.getStock();
			}
			
			oCreateModel1.create(sPath, data, {
				success: fncSuccess,
				error: fncError
			});

		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	});
});