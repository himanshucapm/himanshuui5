jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/insp/displayzinsp_d/model/Formatter"
], function(Controller, formatter) {
	"use strict";
	var that = this;
	return Controller.extend("com.insp.displayzinsp_d.controller.Inspection", {
		formatter: formatter,
		onInit: function() {
			this.newBusy = new sap.m.BusyDialog();

			// this.newBusy.open();
			this.model = this.getOwnerComponent().getModel();

			that = this;

			if (!jQuery.support.touch) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}

		},
		onEnter: function() {
			var that = this;
			var ticket = this.getView().byId("idClaimno").getValue();

			// var sPath =
			// "/sap/opu/odata/sap/ZCS_TICKET_SRV/GetTicketDataSet(ITicketNo='"
			// + ticket + "')";
			var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl);

			var fncSuccess = function(oData, oResponse) // sucess
				// function
				{

					var ary = {
						"d": oData
					};
					var jModel = new sap.ui.model.json.JSONModel(ary);

					that.getView().setModel(jModel, "jModel");
					that.data = jModel.getData();
					/*	that.onAdjusmentMode(that.data.d.ClaimTyp);
						that.onDesposSesion(that.data.d.ClaimTyp);
						that.onRejMode(that.data.d.ClaimTyp);
						that.onAppMode(that.data.d.ClaimTyp);
						that.onAwardMode(that.data.d.ClaimTyp);*/
					that.getView().byId("Id_EntButton").setVisible(false);

					if (that.data.d.EMessage !== "") {
						sap.m.MessageBox.show(that.data.d.EMessage, {
							title: "Error",
							icon: sap.m.MessageBox.Icon.ERROR,
							onClose: function() {
								// window.history.back();
								that.flag = "C";
								that.handleButtonPress();
								that.getView().byId("idSave")
									.setEnabled(false);
							}
						});
					} else {}
					that.Dealer = that.data.d.DealerCode;
					that.State = that.data.d.CustomerRegion;
					that.ClaimType = that.data.d.ClaimTyp;
					that.RecDepoType = that.data.d.ClaimRecDepo;
					that.claimTyp = that.data.d.ClaimTyp.substring(0, 2);

					that.getView().byId("idVbox").setVisible(true);
					that.getView().byId("IdPanelDefect").setVisible(true);
					that.getView().byId("IdPanelFinal").setVisible(true);

					if (that.data.d.ItemType === "TYRE") {
						that.getView().byId("IdPanel").setVisible(true);
						that.getView().byId("IdPanel11").setVisible(true);
						that.getView().byId("IdPanel1").setVisible(false);
						that.getView().byId("IdPanel2").setVisible(false);
					} else {
						if (that.data.d.ItemType === "TUBE") {
							that.getView().byId("idHeaderTube").setText("Tube Details");
							that.getView().byId("idDetailsTube").setText("Tube Inspection Details");
						} else {
							that.getView().byId("idHeaderTube").setText("Flap Details");
							that.getView().byId("idDetailsTube").setText("Flap Inspection Details");
						}

						that.getView().byId("IdPanel").setVisible(false);
						that.getView().byId("IdPanel11").setVisible(false);
						that.getView().byId("IdPanel1").setVisible(true);
						that.getView().byId("IdPanel2").setVisible(true);
					}

					if (that.claimTyp === "ND") {
						that.getView().byId("IdPanel24").setVisible(true);
						that.getView().byId("IdPanel11").setVisible(false);
						that.getView().byId("idinspSkuClass").setSelectedKey("");

					} else {
						that.getView().byId("IdPanel24").setVisible(false);
					}
					if (that.data.d.EarlyFailure === "true") {
						that.getView().byId("Id_EntButton").setVisible(true);
						that.getView().byId("Id_EntButton").setEnabled(true);
					}
					else{
						that.getView().byId("Id_EntButton").setVisible(false);
						that.getView().byId("Id_EntButton").setEnabled(false);
					}
					if (that.data.d.PolicyDocument !== "") {
						that.getView().byId("btnPolicyDoc").setVisible(true);
						that.getView().byId("btnPolicyDoc").setEnabled(true);
					} else {
						that.getView().byId("btnPolicyDoc").setVisible(false);
						that.getView().byId("btnPolicyDoc").setEnabled(false);
					}
				};
			var fncError = function(oError) { // error callback
				// function
				var parser = new DOMParser();
				var message = parser.parseFromString(
						oError.response.body, "text/xml")
					.getElementsByTagName("message")[0].innerHTML
				sap.m.MessageBox.show(message, {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR
				});
			};
			// Create Method for final Save
			oReadModel.read("/GetInspDataSet(IInspNo='" + ticket + "',IClaimNo='')", {
				success: fncSuccess,
				error: fncError
			});

		},
		onFragment: function() {
			if (!this._EntriesHelpDialog) {
				this._EntriesHelpDialog = sap.ui.xmlfragment(
					"com.insp.displayzinsp_d.view.Entries", this);
				this.getView().addDependent(this._EntriesHelpDialog);

			}

			this._EntriesHelpDialog.open();
		},
		onbtnDoc01: function() {
			var docNumber = that.data.d.Document01;
			sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DisplayDMSDocumentSet(DocNo='" + docNumber + "')/$value", true);
		},
		onbtnDoc02: function() {
			var docNumber  = that.data.d.Document02;
			sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DisplayDMSDocumentSet(DocNo='" + docNumber + "')/$value", true);
		},
		onPolicyDoc: function() {
			var docNumber = this.getView().byId("idPolicyDoc").getValue();
			sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DisplayDMSDocumentSet(DocNo='" + docNumber + "')/$value", true);
		},
		onTabelFilterOk: function(){
			this._EntriesHelpDialog.close();
		},
		onClaimF4: function() {
			var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpInspectionSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,
				false, null);
			var _valueHelpTicketSelectDialog = new sap.m.SelectDialog({

				title: "Select Inspection No",
				items: {
					path: "/d/results",
					template: new sap.m.StandardListItem({
						title: "{InspNo}",
						customData: [new sap.ui.core.CustomData({
							key: "Key",
							value: "{InspNo}"
						})],

					}),
				},

				liveChange: function(oEvent) {
					var sValue = oEvent
						.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"InspNo",
						sap.ui.model.FilterOperator.Contains,
						sValue);
					oEvent.getSource().getBinding("items")
						.filter([oFilter]);
				},
				confirm: [this._handleClaimClose, this],
				cancel: [this._handleClaimClose, this]
			});
			_valueHelpTicketSelectDialog.setModel(jModel);
			_valueHelpTicketSelectDialog.open();
		},
		_handleClaimClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("idClaimno").setValue(
					oSelectedItem.getTitle());
				that.onEnter();
			}

		}

	});
});