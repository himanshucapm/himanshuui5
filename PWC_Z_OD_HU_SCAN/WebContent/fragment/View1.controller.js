sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	'sap/ui/core/Fragment',
	"sap/m/MessageBox",
	"zexpoinvoice/util/Formatter",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast,Fragment, MessageBox,Formatter,JSONModel) {
"use strict";
var that, ProductJModel;
	
return Controller.extend("zexpoinvoice.controller.View1", {
	onInit: function () {
		debugger
		 var that = this;
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(this._onRoute, this);
		
		/*ProductJModel = new sap.ui.model.json.JSONModel();
		this.getView().byId("idProductTable").setModel(ProductJModel, "ProductJModel");*/

		this.getView().byId("idoffice").setText("PATRIOT HOUSE,3 BSZ MARG  \n NEW DELHI 110002, INDIA");
		this.getView().byId("idEmployee").setText("PATRIOT HOUSE,3 BSZ MARG  \n NEW DELHI 110002, INDIA");
		this.getView().byId("idApplicat").setText("SAMEER AFRICA LIMITED \n PO BOX 30429-00100 \n NAIRBI, KENYA ");
		this.onDiscType();
		this.onMenufacLocation();
		this.onCertificationsReqt();
		this.onTyreMakingReqt();

	},
	
	_onRoute : function(e){
		debugger			
	
	},
	
	onCreateExPort:function(e){
		debugger
		    	var selectedData={};
		    	var tempjsonString = JSON.stringify(selectedData);
				var jsonstring = tempjsonString.replace(/\//g, "@");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});
	},
	
///////////////////////////////////////////Fragment Code//////////////////////////////////////////////////////
	onAfterRendering:function(){
		this._CustomerDialog = sap.ui.xmlfragment("zexpoinvoice.view.Customer", this);
		this._CustomerDialog.open();
	},
	
	//customer F4 code  
	onCustomerFragment:function(){
		that = this;
		var user = new sap.ushell.services.UserInfo();
		var uid = user.getId()
		var sPath = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/F4EmpTerminateSet?$filter=EmpId eq ''";
		var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpCustomerSelectDialog = new sap.m.SelectDialog({
					title : "Select Customer",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{EmpId}",
							description: "{EmpName}",
							customData : [ new sap.ui.core.CustomData({
								key : "{EmpId}",
								value : "{EmpName}"
							})],
						}),
					},
					
			liveChange : function(oEvent) {
				 var sValue = oEvent.getParameter("value");
			     var oFilter = new sap.ui.model.Filter("EmpId",sap.ui.model.FilterOperator.Contains,sValue);
			     var oFilter1 = new sap.ui.model.Filter("EmpName",sap.ui.model.FilterOperator.Contains,sValue);
			     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
					 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
				confirm : [ this._handleCusomterClose, this ],
				cancel  : [ this._handleCustomerClose, this ]
			});
		_valueHelpCustomerSelectDialog.setModel(jModel);
		_valueHelpCustomerSelectDialog.open();
		},
		_handleCusomterClose : function(oEvent) {
			debugger
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var obj = oSelectedItem.getBindingContext().getObject();
			if (oSelectedItem) {
					sap.ui.getCore().byId("idCustomerType").setValue(obj.EmpId);
			}
			/*var ListSetJModel = new sap.ui.model.json.JSONModel();
			this.EmployeeDialog = sap.ui.xmlfragment("zInitiESeparat.view.EmployeeId",this);
			this.getView().addDependent(this.EmployeeDialog);
			this.EmployeeDialog.setModel(ListSetJModel, "ListSetJModel");
			this.EmployeeDialog.open();*/
	},
	
	//for Ok button on fragment
	onRequestOk : function(){
	var Customer = sap.ui.getCore().byId("idCustomerType").getValue();
		if(Customer == ""){
			sap.ui.getCore().byId("idCustomerType").setValueState(sap.ui.core.ValueState.Error);
			return;
		} else { 
			sap.ui.getCore().byId("idCustomerType").setValueState(sap.ui.core.ValueState.None);
			//this.OncustomerDetails();  
			//this.onDealerInfo();
		}
		this._CustomerDialog.close();
		this._CustomerDialog.destroy(); 
		this._CustomerDialog=undefined;
		},
		
	//for cancel button on fragment
		onRequestCancel :function(){
			window.history.back();
		},


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		onProductHelp:function(){
			that = this;
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId()
			var sPath = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/F4EmpTerminateSet?$filter=EmpId eq ''";
			var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
			var _valueHelpProductSelectDialog = new sap.m.SelectDialog({
						title : "Select Customer",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem({
								title : "{EmpId}",
								description: "{EmpName}",
								customData : [ new sap.ui.core.CustomData({
									key : "{EmpId}",
									value : "{EmpName}"
								})],
							}),
						},
						
				liveChange : function(oEvent) {
					 var sValue = oEvent.getParameter("value");
				     var oFilter = new sap.ui.model.Filter("EmpId",sap.ui.model.FilterOperator.Contains,sValue);
				     var oFilter1 = new sap.ui.model.Filter("EmpName",sap.ui.model.FilterOperator.Contains,sValue);
				     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
						 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
				},
					confirm : [ this._handleProductClose, this ],
					cancel  : [ this._handleProductClose, this ]
				});
			_valueHelpProductSelectDialog.setModel(jModel);
			_valueHelpProductSelectDialog.open();
			},
			_handleProductClose : function(oEvent) {
				debugger
				var oSelectedItem = oEvent.getParameter("selectedItem");
				var obj = oSelectedItem.getBindingContext().getObject();
				if (oSelectedItem) {
						this.getView().byId("IdProductType").setValue(obj.EmpId);
				}
		},
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		onItemHelp:function(){
			that = this;
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId()
			var sPath = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/F4EmpTerminateSet?$filter=EmpId eq ''";
			var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
			var _valueHelpItemSelectDialog = new sap.m.SelectDialog({
						title : "Select Customer",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem({
								title : "{EmpId}",
								description: "{EmpName}",
								customData : [ new sap.ui.core.CustomData({
									key : "{EmpId}",
									value : "{EmpName}"
								})],
							}),
						},
						
				liveChange : function(oEvent) {
					 var sValue = oEvent.getParameter("value");
				     var oFilter = new sap.ui.model.Filter("EmpId",sap.ui.model.FilterOperator.Contains,sValue);
				     var oFilter1 = new sap.ui.model.Filter("EmpName",sap.ui.model.FilterOperator.Contains,sValue);
				     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
						 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
				},
					confirm : [ this._handleItemClose, this ],
					cancel  : [ this._handleItemClose, this ]
				});
			_valueHelpItemSelectDialog.setModel(jModel);
			_valueHelpItemSelectDialog.open();
			},
			_handleItemClose : function(oEvent) {
				debugger
				var oSelectedItem = oEvent.getParameter("selectedItem");
				var obj = oSelectedItem.getBindingContext().getObject();
				if (oSelectedItem) {
					this.getView().byId("IdItemCode").setValue(obj.EmpId);
				}
				
		},
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		onDiscountHelp:function(){
			that = this;
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId()
			var sPath = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/F4EmpTerminateSet?$filter=EmpId eq ''";
			var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
			var _valueHelpDisCountSelectDialog = new sap.m.SelectDialog({
						title : "Select Customer",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem({
								title : "{EmpId}",
								description: "{EmpName}",
								customData : [ new sap.ui.core.CustomData({
									key : "{EmpId}",
									value : "{EmpName}"
								})],
							}),
						},
						
				liveChange : function(oEvent) {
					 var sValue = oEvent.getParameter("value");
				     var oFilter = new sap.ui.model.Filter("EmpId",sap.ui.model.FilterOperator.Contains,sValue);
				     var oFilter1 = new sap.ui.model.Filter("EmpName",sap.ui.model.FilterOperator.Contains,sValue);
				     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
						 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
				},
					confirm : [ this._handleDiscountClose, this ],
					cancel  : [ this._handleDiscountClose, this ]
				});
			_valueHelpDisCountSelectDialog.setModel(jModel);
			_valueHelpDisCountSelectDialog.open();
			},
			_handleDiscountClose : function(oEvent) {
				debugger
				var oSelectedItem = oEvent.getParameter("selectedItem");
				var obj = oSelectedItem.getBindingContext().getObject();
				if (oSelectedItem) {
					this.getView().byId("IdDiscountType").setValue(obj.EmpId);
				}
				
		},
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    onDiscType:function(){
			 debugger
				//Method for setting the model for Primary Reason
	            var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4ResStatusSet";
	           var jModel = new sap.ui.model.json.JSONModel();
		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
		 		var  loc= this.getView().byId("IdDiscType");
				loc.unbindAggregation("items");
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
						key : "{ResStatus}",
						text : "{ResStatusText}"
					})
				});		
				},	 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			onMenufacLocation:function(){
			 debugger
			//Method for setting the model for Primary Reason
			var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4ResStatusSet";
			var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
			var  loc= this.getView().byId("IdMenufac");
				 loc.unbindAggregation("items");
				 loc.setModel(jModel);
				 loc.bindAggregation("items", {
				 path : "/d/results",
				 template : new sap.ui.core.Item({
				 key : "{ResStatus}",
				 text : "{ResStatusText}"
					})
						});		
						},	 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			onCertificationsReqt:function(){
				debugger
				//Method for setting the model for Primary Reason
				var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4ResStatusSet";
				var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false,"GET",false, false, null);
				var loc= this.getView().byId("IdCertificationReqt");
					loc.unbindAggregation("items");
					loc.setModel(jModel);
					loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
					key : "{ResStatus}",
					text : "{ResStatusText}"
						})
						});		
					},	 		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			onTyreMakingReqt:function(){
				 debugger
			//Method for setting the model for Primary Reason
			var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4ResStatusSet";
			var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
			var  loc= this.getView().byId("IdTyreMakingReqt");
			 	 loc.unbindAggregation("items");
				 loc.setModel(jModel);
				 loc.bindAggregation("items", {
				 path : "/d/results",
				 template : new sap.ui.core.Item({
				 key : "{ResStatus}",
				 text : "{ResStatusText}"
				})
					});		
				},	 		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				handleIconTabBarSelect: function(oEvent) {
					debugger
					var filter = oEvent.getParameters().key;
					var tabBar= this.getView().byId("iconTabBar");
					var headerValid= this.validateHeaderDetails();
					if(headerValid)
					{
						this.onHeaderFix();
						this.checkFilter(filter);
					}
					else
					{
						tabBar.setSelectedKey("A");
						sap.m.MessageBox.show("Please fill all the mandatory fields in Product Details.", {
							title : "Error",
							icon : sap.m.MessageBox.Icon.ERROR,
						});
						return false;
					}
					
				},
				checkFilter: function(filter) {
					switch (filter) {
						case 'A':
							break;
						case 'B':
							break;
						case 'C':
							break;
						case 'D':
							break;
						
					}
				},
				
				//code added for validate header tab fields	
					validateHeaderDetails: function(){
						debugger
						var valid = false;
						var ProductType = this.getView().byId("IdProductType");
						var ItemCode = this.getView().byId("IdItemCode");
						var PCSSets = this.getView().byId("IdPcsSet");
						var Discount = this.getView().byId("IdDiscountType");
						var Value = this.getView().byId("IdValue");
						
						if(ProductType.getValue() == "" || ItemCode.getValue() == "" || PCSSets.getValue() == "" || Discount.getValue() == "" || Value.getValue() ==""){
							if(ProductType.getValue()==""){
								ProductType.setValueState("Error");
							}else{
								ProductType.setValueState("None");
							}
							if(ItemCode.getValue()==""){
								ItemCode.setValueState("Error");
							}else{
								ItemCode.setValueState("None");
							}
							if(PCSSets.getValue()==""){
								PCSSets.setValueState("Error");
							}else{
								PCSSets.setValueState("None");
							}
							if(Discount.getValue()==""){
								Discount.setValueState("Error");
							}else{
								Discount.setValueState("None");
							}
							if(Value.getValue()==""){
								Value.setValueState("Error");
							}else{
								Value.setValueState("None");
							}
							valid=false;
							
						}else{
							valid=true;
						}
						return valid;
					},
				// Function to disable all header fields when the user moves to a different tab	
				onHeaderFix : function(){
					debugger
							this.getView().byId("IdItemCode").setEnabled(false);
							this.getView().byId("IdPcsSet").setEnabled(false);
							
				},
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				onAdd:function(){
					debugger
					var oView = this.getView();
					var ProductJModel = oView.getModel("ProductJModel");
					if (!ProductJModel) {
						ProductJModel = new sap.ui.model.json.JSONModel();
						oView.setModel(ProductJModel, "ProductJModel");
					}
					var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";
					var sPathProductJModel = "/EmpSeparationSet(Guid='')";
					var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					var oParamsProductJModel = {};
					oParamsProductJModel.context = "";
					oParamsProductJModel.urlParameters = "";
					oParamsProductJModel.success = function(oData, oResponse) { // success handler
						debugger
						delete oData.__metadata;
						oData.results=[];
						oData.results.push(oData);
						
						ProductJModel.setData(oData.results);
					};
					oParamsProductJModel.error = function(oError) { // error handler 		
						jQuery.sap.log.error("read publishing group data failed");
					}.bind(this);
					frameworkODataModel.read(sPathProductJModel, oParamsProductJModel);
					frameworkODataModel.attachRequestCompleted(function() {
					});
					
					/*var Producttype = this.getView().byId("IdProductType").getValue();
					var ItemCode 	= this.getView().byId("IdItemCode").getValue();
					var PCSSet 		= this.getView().byId("IdPcsSet").getValue();
					var Discount 	= this.getView().byId("IdDiscountType").getValue();
				
					
					
					var check  = false;
					var oView = this.getView();
					var user = new sap.ushell.services.UserInfo();
					var uid = user.getId();
					var EmpId   = this.getView().byId("IdEmp").getValue();
					var Status	= this.getView().byId("idStatus").getSelectedKey();
					if(this.dateFrom > this.dateTo){
						sap.m.MessageToast.show("From-Date cannot be greater than To-Date.");
						this.getView().byId("fromDate").setValueState("Error");
						this.getView().byId("toDate").setValueState("Error");
						return false
						}
					else{
						this.getView().byId("fromDate").setValueState("None");
						this.getView().byId("toDate").setValueState("None");
						}
				 	var oViewObj = this.getView();
					var that = this;
					var EmpListSetJModel = oViewObj.getModel("EmpListSetJModel");
					if (!EmpListSetJModel) {
						EmpListSetJModel = new sap.ui.model.json.JSONModel();
						oViewObj.setModel(EmpListSetJModel, "EmpListSetJModel");
					}
					var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";
					var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					oReadModel.setHeaders({
						"Content-Type" : "application/json"
					});
					var fncSuccess = function(oData, oResponse) 									// success function
					{
						debugger
						EmpListSetJModel.setData(oData.results);
					
					}
					var fncError = function(oError) { 	 											// error handler
						jQuery.sap.log.error("read publishing group data failed");
						sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
					};

					if(this.dateFrom){
						var path = "SeparationApproveSet?$filter=ResStatus  eq '"+Status+"' and ResDateFrom  eq datetime'"+this.dateFrom+"' and ResDateTo  eq datetime'"+this.dateTo+"' and EmpId  eq '"+EmpId+"'";
					}else{
						var path = "SeparationApproveSet?$filter=ResStatus  eq '"+Status+"' and ResDateFrom eq "+null+'  and ResDateTo eq '+null+"  and EmpId  eq '"+EmpId+"'";
					}
					
					oReadModel.read(path, {
						  success : fncSuccess,
						   error : fncError
						   });
*/				
					},
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				onRemoveRow:function(evt){
					debugger
					var ProductTble = this.getView().byId("idProductTable");
					var path = evt.getSource().getParent().oBindingContexts.ProductJModel.sPath.split('/')[1];
					if(	path !== -1){
						ProductTble.getModel("ProductJModel").getData().splice(path,1);
						ProductTble.getModel("ProductJModel").refresh();
					}
				},
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				onSave:function(){

					debugger;
					var that = this;
					var mode = "S";
					var valid = true;
					var tabBar = this.getView().byId("iconTabBar");
					var validate = this.validateHeaderDetails();
//				
					if(!validate){
						sap.m.MessageBox.alert(
								"Product Type & Item Code & Pcs/Sets/No & Discount Type Please fill the value.", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Error"
								}
							);
						tabBar.setSelectedKey("A");
						valid=false;
						return false;
					}
					
					if(!validate){
						sap.m.MessageBox.alert(
								"Enter All mandatory fields", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Error"
								}
							);
						tabBar.setSelectedKey("B");
						valid=false;
						return false;
					}else{
						tabBar.setSelectedKey("A");
						tabBar.setSelectedKey("B");
					}
					if(valid){
						debugger
						sap.m.MessageBox.show(
					      "Data reviewed successfully, Are you sure you want to save data?", {
					        icon: sap.m.MessageBox.Icon.INFORMATION,
					        title: "Information",
					        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					        onClose: function(oAction) {
					          if (oAction === sap.m.MessageBox.Action.YES) {
//					     		 changed by payload 
					        	 var payload = that.createPayload(mode);
					  			//	that.onCreateTestRequestSet(payload, mode);      	  
					          }
					        }
					      });
					}

				},
				createPayload:function(mode){
					debugger
					var Producttype 	= this.getView().byId("IdProductType").getValue();
					var ItemCode		= this.getView().byId("IdItemCode").getValue();
					var PCSSet			= this.getView().byId("IdPcsSet").getValue();
					var Discounttype	= this.getView().byId("IdDiscountType").getValue();
					var value			= this.getView().byId("IdValue").getValue();
				},
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
});