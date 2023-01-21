/* global zxing-pdf417:true */
sap.ui.define([ 
	"com/musashi/scan/controller/BaseController",
	"sap/m/MessageToast", 
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/ui/model/json/JSONModel",
	"com/musashi/scan/model/Formatter",
	'sap/ui/model/Filter', 
	"sap/m/UploadCollectionParameter",
	"sap/ui/comp/filterbar/FilterBar",
	/*"Z_OD_HU_SCAN/js/zxing-pdf417"*/
	],
function(BaseController,  MessageToast,MessageBox,MessagePopover,JSONModel, Formatter,
			Filter,UploadCollectionParameter,FilterBar/*,zxingpdf417js*/) {
	
	"use strict";
	var that;
	var fragmentModel;
	var gCtx = null;
	var gCanvas = null;
	var c=0;
	var stype=0;
	var gUM=false;
	var webkit=false;
	var moz=false;
	var v=null;
	var Controller = BaseController.extend("com.musashi.scan.controller.Home", {

		oFormatter : Formatter,

		onInit : function() {
			that = this;
			var obj={
					busy:false,
					delay:0
			};
			var oPageModel=new JSONModel(obj);
			this.getView().setModel(oPageModel,"oPageModel");
			var filterObj={
					filterDocDateFrom:null,
					filterDocDateTo:null,
					filterPlant:"",
					filterSoldToParty:"",
					filterDeliveryNo:"",
					filterPostingDate:null,
					filterNoOfPackage:""
			};
			var filterModel=new JSONModel(filterObj);
			this.getView().setModel(filterModel,"filterModel");
			this.getPlantData();
			this.getSoldToPartyData();
			fragmentModel = new JSONModel();
			
			var oDatePicker = this.getView().byId("idDateRange");
			oDatePicker.addEventDelegate({
				onAfterRendering: function(){
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#'+oID).attr("disabled", "disabled"); 
				}
			},oDatePicker);
			
			this.getView().byId("idDateRange").setDateValue(new Date());
			this.getView().byId("idDateRange").setSecondDateValue(new Date());
		},
		
		//get sold to party data
				getSoldToPartyData:function(oEvent){
					var oPageModel=this.getModel("oPageModel");
					oPageModel.setProperty("/busy",true);
					var oModel=this.getModel();
					var sPath="/F4SoldToPartySet";
					oModel.read(sPath,{
						success:function(oData,oResponse){
							oPageModel.setProperty("/busy",false);
							oPageModel.setProperty("/soldToPartyItems",oData.results)
						},error:function(err){
							oPageModel.setProperty("/busy",false);
							MessageBox.show(err.responseText,"ERROR","Error");
						}
					});
				},
				//get Sold to Party
				getPlantData:function(oEvent){
					var oPageModel=this.getModel("oPageModel");
					oPageModel.setProperty("/busy",true);
					var oModel=this.getModel();
					var sPath="/F4PlantSet";
					oModel.read(sPath,{
						success:function(oData,oResponse){
							oPageModel.setProperty("/busy",false);
							oPageModel.setProperty("/plantItems",oData.results)
						},error:function(err){
							oPageModel.setProperty("/busy",false);
							MessageBox.show(err.responseText,"ERROR","Error");
						}
					});
				},
				// handle plant value help
				handlePlantHelp:function(oEvent){
					this.oVHSrc=oEvent.getSource();
					if(!this.plantF4Dialog){
						this.plantF4Dialog=sap.ui.xmlfragment("com.musashi.scan.fragment.PlantVHDialog", this);
						this.getView().addDependent(this.plantF4Dialog);
					}
					this.plantF4Dialog.open();
					

				},
				// on confirm plant value help
				_handlePlantF4Confirm:function(oEvent){
					var oSelectedItem=oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						this.oVHSrc.setValue(oSelectedItem.getTitle());
					}
					oEvent.getSource().getBinding("items").filter([]);
				},
				//handle search plant value help
				_handlePlantValueHelpSearch:function(oEvent){
					var sValue = oEvent.getParameter("value");
					var oFilter1 = new Filter("Plant","Contains", sValue);
					var oFilter2 = new Filter("PlaneName","Contains", sValue);
					var oFilter=new Filter([oFilter1,oFilter2]);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//handle delivery number value help 
				handleDeliveryNoF4Help:function(oEvent){
					this.oVHSrc=oEvent.getSource();
					if(!this.deliveryNoF4Dialog){
						this.deliveryNoF4Dialog=sap.ui.xmlfragment("com.musashi.scan.fragment.DeliveryNoVHDialog", this);
						this.getView().addDependent(this.deliveryNoF4Dialog);
					}

					var filterModel=this.getModel("filterModel");
					var fromDate=filterModel.getProperty("/filterDocDateFrom");
					var toDate=filterModel.getProperty("/filterDocDateTo");
					var plant=filterModel.getProperty("/filterPlant");
					var soldToParty=filterModel.getProperty("/filterSoldToParty");
					var flag="",msg="";

					if(!fromDate || !toDate){
						msg=msg+"Please select valid document date\n";
						flag="X";
					}
					if(!plant){
						msg=msg+"Please select valid plant\n";
						flag="X";
					}
					if(flag){
						MessageBox.show(msg,"ERROR","Error");
						return;
					}
					this.deliveryNoF4Dialog.open();
					
					
					var Filters=[];
					var oFilter1=new Filter("DateLow","EQ",this.oFormatter.dateFormat_yyyy_mm_ddT(fromDate));
					Filters.push(oFilter1);
					var oFilter2=new Filter("DateHigh","EQ",this.oFormatter.dateFormat_yyyy_mm_ddT(toDate));
					Filters.push(oFilter2);
					var oFilter3=new Filter("Plant","EQ",plant);
					Filters.push(oFilter3);
					if(soldToParty){
						var oFilter4=new Filter("SoldToParty","EQ",soldToParty);
						Filters.push(oFilter4);						
					}

					this.getDeliveryNumberF4Data(Filters);
				},

				getDeliveryNumberF4Data:function(Filters){
					var oPageModel=this.getModel("oPageModel");
					oPageModel.setProperty("/busy",true);
					var oModel=this.getModel();
					var sPath="/F4DeliveryNumberSet";
					oModel.read(sPath,{filters:Filters,
						success:function(oData,oResponse){
							oPageModel.setProperty("/busy",false);
							oPageModel.setProperty("/deliveryNoItems",oData.results)
						},error:function(err){
							oPageModel.setProperty("/busy",false);
							MessageBox.show(err.responseText,"ERROR","Error");
						}
					});
				},

				_handleDeliveryNumberF4Confirm:function(oEvent){
					var oSelectedItem=oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						var sObj=oSelectedItem.getBindingContext("oPageModel").getObject();
						this.oVHSrc.setValue(sObj.Deliv_no);
						this.getMaterialData();
					}
					oEvent.getSource().getBinding("items").filter([]);
				},

				_handleDeliveryNumberSearch:function(oEvent){
					var sValue = oEvent.getParameter("value");
					var oFilter1 = new Filter("Deliv_no","Contains", sValue);
					var oFilter2 = new Filter("SoldToParty","Contains", sValue);
					var oFilter3 = new Filter("Name","Contains", sValue);
					var oFilter4 = new Filter("Plant","Contains", sValue);
					var oFilter5 = new Filter("Dist_Channel","Contains", sValue);
					var oFilter=new Filter([oFilter1,oFilter2,oFilter3,oFilter4,oFilter5]);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//handleSoldToPartyHelp
				handleSoldToPartyHelp:function(oEvent){
					this.oVHSrc=oEvent.getSource();
					if(!this.soldToPartyF4Dialog){
						this.soldToPartyF4Dialog=sap.ui.xmlfragment("com.musashi.scan.fragment.SoldToPartyVHDialog", this);
						this.getView().addDependent(this.soldToPartyF4Dialog);
					}

					this.soldToPartyF4Dialog.open();
					

				},

				//_handleSoldToPartyF4Confirm
				_handleSoldToPartyF4Confirm:function(oEvent){
					var oSelectedItem=oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						this.oVHSrc.setValue(oSelectedItem.getTitle());
					}
					oEvent.getSource().getBinding("items").filter([]);
				},

				//handle search Sold To Party Help
				_handleSoldToPartyVHSearch:function(oEvent){
					var sValue = oEvent.getParameter("value");
					var oFilter1 = new Filter("SoldToParty","Contains", sValue);
					var oFilter2 = new Filter("Name1","Contains", sValue);
					var oFilter=new Filter([oFilter1,oFilter2]);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//handle value help close
				_handleValueHelpClose:function(oEvent){
					oEvent.getSource().getBinding("items").filter([]);
				},

				onSearchGoPress:function(oEvent){
					this.getMaterialData();
				},
				//get Material data with respect to Delivery Number
				getMaterialData:function(oEvent){
					var filterModel=this.getModel("filterModel");
					var filterDeliveryNo=filterModel.getProperty("/filterDeliveryNo");
					if(!filterDeliveryNo){
						MessageBox.show("Please select valid delivery number","ERROR","Error");
						return;
					}

					var Filters=[];
					var oFilter1=new Filter("DlvryNo","EQ",filterDeliveryNo);
					Filters.push(oFilter1);

					var oPageModel=this.getModel("oPageModel");
					oPageModel.setProperty("/busy",true);
					var oModel=this.getModel();
					
					var sService = "/sap/opu/odata/sap/ZSCANREPORT_SRV/";
					var serviceModel = new sap.ui.model.odata.ODataModel(sService);
					//var sPath="/ScanningDataSet?$filter=DlvryNo eq '"+filterDeliveryNo+"'&$expand=DataHUNvg";
					var sPath="/DeliveryDataSet?$filter=DlvryNo eq '"+filterDeliveryNo+"'&$expand=DataHUNvg";
					
					/*oModel.read(sPath,{filters:Filters,
						success:function(oData,oResponse){
							oPageModel.setProperty("/busy",false);
							oPageModel.setProperty("/materialItems",oData.results)
						},error:function(err){
							oPageModel.setProperty("/busy",false);
							MessageBox.show(err.responseText,"ERROR","Error");
						}
					});*/
					
					var sParameters = {};
					sParameters.success=function(oData,oResponse){
						oPageModel.setProperty("/busy",false);
						oPageModel.setProperty("/materialItems",oData.results)
					};
					sParameters.error=function(oError){
						oPageModel.setProperty("/busy",false);
						MessageBox.show(oError.responseText,"ERROR","Error");
					};
					
					serviceModel.read(sPath,sParameters);
				},

				//handle bar code success
				onBarCodeScanSuccess:function(oEvent){
					var oSrc=oEvent.getSource();
					var bCtx=oSrc.getBindingContext("oPageModel");
					var oScanText=oEvent.getParameter("text");
					var format=oEvent.getParameter("format");
					var cancelled = oEvent.getParameter("cancelled");
					if(!cancelled){
						this.getHUScanQuanttity(bCtx,oScanText);
					}
				},
				//get handling unit scanned quantity
				getHUScanQuanttity:function(bCtx,scanText){

					var sObj=bCtx.getObject();
					var oPageModel=this.getModel("oPageModel");
					if(sObj.DataHUNvg){
						for(var i=0;i<sObj.DataHUNvg.results.length;i++){
							if(sObj.DataHUNvg.results[i].ScanHu == scanText){
								var msg="Handling unit is already scanned";
								MessageBox.show(msg,"ERROR","Error");
								return;
							}
						}
					}else{
						sObj.DataHUNvg={};
						sObj.DataHUNvg.results=[];
					}

//					var Filters=[];
//					var oFilter1=new Filter("LineItem","EQ",sObj.LineItem);
//					Filters.push(oFilter1);
//					var oFilter2=new Filter("DlvryNo","EQ",sObj.DlvryNo);
//					Filters.push(oFilter2);
//					var oFilter2=new Filter("ScanHu","EQ",scanText);
//					Filters.push(oFilter2);

					oPageModel.setProperty("/busy",true);
					var oModel=this.getModel();
					//var sPath="/GetHandlingUnitSet(LineItem='"+sObj.LineItem+"',DlvryNo='"+sObj.DlvryNo+"',ScanHu='"+scanText+"',Matnr='"+sObj.Material+"',DlvryQty='"+sObj.MatQty+"')";
					/*
					oModel.read(sPath,{
						//filters:Filters,
						success:function(oData,oResponse){
							oPageModel.setProperty("/busy",false);
							var data=oData;
							var ScanQty = parseFloat(sObj.ScanQty) + parseFloat(data.ScanLfimg);
							if(ScanQty > sObj.MatQty){
								var msg="Total scanned quantity should not exceed Delivery Quantity";
								MessageBox.show(msg,"ERROR","Error");
								return;
							}
							sObj.DataHUNvg.push({
								ScanHu:scanText,
								ScanQty:ScanQty.toFixed(2)
							});
							sObj.ScanQty=ScanQty.toFixed(2);
							oPageModel.refresh();

						},error:function(err){
							oPageModel.setProperty("/busy",false);
							var msg="";
							if(err.responseText.indexOf("<") == -1){
								msg=JSON.parse(err.responseText).error.message.value;
							}else{
								msg=err.responseText;
							}
							MessageBox.show(msg,"ERROR","Error");
						}
					});
					*/
					/*var ScanQty = parseFloat(sObj.ScanQty) + parseFloat(data.ScanLfimg);
					if(ScanQty > sObj.MatQty){
						var msg="Total scanned quantity should not exceed Delivery Quantity";
						MessageBox.show(msg,"ERROR","Error");
						return;
					}*/
					var sPath="/GetHandlingUnitSet";
					var payload={};
					payload.LineItem=sObj.LineItem;
					payload.DlvryNo=sObj.DlvryNo;
					payload.ScanHu=scanText;
					payload.Matnr=sObj.Material;
					payload.DlvryQty=sObj.MatQty;
					payload.ScanLfimg=sObj.ScanQty;
					
					var oParamsPOHeaderSet = {};
					
					oParamsPOHeaderSet.success = function(oData, oResponse) {
						oPageModel.setProperty("/busy",false);
						var data=oData;
						var matnr=oData.Matnr;
						MessageBox.show("HU assigned to materal "+matnr+"","SUCCESS","Success");
						var ScanQty = parseFloat(sObj.ScanQty) + parseFloat(data.ScanLfimg);
						/*ItemToHuNvg*/
						sObj.DataHUNvg.results.push({
							ScanHu:scanText,
							ScanQty:ScanQty.toFixed(2)
						});
						sObj.ScanQty=ScanQty.toFixed(2);
						oPageModel.refresh();

					};
					oParamsPOHeaderSet.error = function(oError) {
						oPageModel.setProperty("/busy",false);
						var msg="";
						if(oError.responseText.indexOf("<") == -1){
							msg=JSON.parse(oError.responseText).error.message.value;
						}else{
							msg=oError.responseText;
						}
						MessageBox.show(msg,"ERROR","Error");
					}

					oModel.create(sPath, payload, oParamsPOHeaderSet);

					oModel.attachRequestCompleted(function() {
						
					});
					
				},

			//handle on press submit
			onSubmitPress:function(oEvent){
					var oPageModel=this.getModel("oPageModel");
					var materialItems=oPageModel.getProperty("/materialItems");
					if(!materialItems || materialItems.length==0){
						var msg="No items available in the table";
						MessageBox.show(msg,"ERROR","Error");
						return;
					}
					var filterModel=this.getModel("filterModel");
					var payload={
							DlvryNo:filterModel.getProperty("/filterDeliveryNo"),
							HeadToErrorNvg:[],
					};
					for(var i=0;i<materialItems.length;i++){
						if(parseFloat(materialItems[i].MatQty).toFixed(2) != parseFloat(materialItems[i].ScanQty)){
							var msg="Scanned quantity should be equal to Delivery Quantity for line item "+(i+1);
							MessageBox.show(msg,"ERROR","Error");
							return;
						}
//						materialItems[i].MatQty=materialItems[i].MatQty.toString();
//						materialItems[i].ScanQty=materialItems[i].ScanQty.toString();
						/*payload.HeadToItemNvg.push({
							LineItem:materialItems[i].LineItem,
							DataHUNvg:materialItems[i].DataHUNvg.results
						});*/
					}
					
					
					//payload.FromRole_HeadToItem=materialItems;
					oPageModel.setProperty("/busy",true);
					var oModel=this.getModel();
					var sPath="/DocumentPostHeadSet";
					oModel.create(sPath,payload,{
						success:function(oData,oResponse){
								
								oPageModel.setProperty("/busy",false);
								if(oData.Error==""){
									MessageBox.show("PGI Executed Successfully.","SUCCESS","Success");
								}else if(oData.Error=='X'){
									var errorModel= new JSONModel();
									errorModel.setData(oData.HeadToErrorNvg.results);
									
										if (!that.ErrorFragment) {
											that.ErrorFragment = sap.ui.xmlfragment(
													"com.musashi.scan.view.ErrorFragment", that);
										}
									that.ErrorFragment.open();
									sap.ui.getCore().byId("idErrorTable").setModel(errorModel,"errorModel");
								}
								
								this.setScreenInitial();
						}.bind(this),
						error:function(err){
							
							oPageModel.setProperty("/busy",false);
							MessageBox.show(err.responseText,"ERROR","Error");
						}.bind(this)
					});
				},
				
				onErrorFragmentClose:function(){
					that.ErrorFragment.close();
				},
				
				setScreenInitial:function(e){
					var oPageModel=this.getModel("oPageModel");
					oPageModel.setProperty("/materialItems",[]);
					var filterObj={
							filterDocDateFrom:this.getView().getModel("filterModel").getProperty("/filterDocDateFrom"),
							filterDocDateTo:this.getView().getModel("filterModel").getProperty("/filterDocDateTo"),
							filterPlant:"",
							filterSoldToParty:"",
							filterDeliveryNo:"",
							filterPostingDate:null,
							filterNoOfPackage:""
					};
					var filterModel=new JSONModel(filterObj);
					this.getView().setModel(filterModel,"filterModel");
				},

				onClearPageFilter:function(oEvent){
					this.setScreenInitial();
				},//
				
				//***************************Start BarCode Scanning **************************//
				onPressHUDetails:function(oEvent){
					debugger
					that = this;
					var index = oEvent.getSource().getParent().getBindingContextPath().split('/')[2];
					var HUdata = this.getView().getModel("oPageModel").getData().materialItems[index].DataHUNvg.results;
					var dataModel= new JSONModel();
					dataModel.setData(HUdata);
					
					if (!that.HUFragment) {
						that.HUFragment = sap.ui.xmlfragment(
								"com.musashi.scan.view.HUFragment", that);
					}
					that.HUFragment.open();
					

					sap.ui.getCore().byId("idFragTable").setModel(dataModel,"dataModel");
					
				},
				
				onHUFragmentClose:function(){
					that.HUFragment.close();
				},
				
				onBarcodeScanButtonPress:function(e){
					this.setCanvasInitial();
					this.scanCode(e);
				},
				
				setCanvasInitial:function(e){
					function initCanvas(w,h){
					    //gCanvas = document.getElementById("qr-canvas");
						gCanvas=document.createElement("canvas");
						gCanvas.id="out-canvas";
					    gCanvas.style.width = w + "px";
					    gCanvas.style.height = h + "px";
					    gCanvas.width = w;
					    gCanvas.height = h;
					    gCtx = gCanvas.getContext("2d");
					    gCtx.clearRect(0, 0, w, h);
					}
					initCanvas(300,300);
				},
				
				scanCode: function(oEvent) {
					this.codeScanned = false;
					var container = new sap.m.VBox({
						//visible:false,
						"width": "512px",
						"height": "384px"
					});
					var button = new sap.m.Button("", {
						text: "Cancel",
						type: "Reject",
						press: function() {
							dialog.close();
						}
					}).addStyleClass("sapUiTinyMarginEnd");
					var handleFiles=function (f){
						var o=[];
						for(var i =0;i<f.length;i++){
							var reader = new FileReader();
							reader.onload = (function(theFile) {
								return function(e) {
									//gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
									//qrcode.decode(e.target.result);
									debugger;
									var img=$("#img")[0];
									img.src=e.target.result;
									setTimeout(function(){
										gCanvas.width=img.naturalWidth;
										gCanvas.height=img.naturalHeight;
										gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
										gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
										this.decodePDF417(gCtx,img);
									}.bind(this), 100); 
									//container.getDomRef().appendChild(gCanvas);
								}.bind(this);
							}.bind(this))(f[i]);
							reader.readAsDataURL(f[i]);	
						}
					}.bind(this)
					var buttonUpload = new sap.ui.core.HTML({	
						content:'<input type="file" id="upload"></input><br/> <img src="" id="img"/>',
						// use the afterRendering event for 2 purposes
						afterRendering : function(oEvent) {
							if ( !oEvent.getParameters()["isPreservedDOM"] ) {
								var $DomRef = $("#upload");
								$DomRef.change(function(oEvent) {
									debugger;
									handleFiles(oEvent.target.files);
								}.bind(this));
							}
						}.bind(this)
					});
					var dialog = this.dialog = new sap.m.Dialog({
						title: "Scan Window",
						content: [
							container,
							button,
							buttonUpload
							]
					});
					dialog.open();
					
					
					var uploader=sap.ui.getCore().byId("upload");
					
					var video = document.createElement("video");
					video.autoplay = true;
					var that = this;
					
					var canvas = document.createElement("canvas");
					canvas.width = 512;
					canvas.height = 384;
					navigator.mediaDevices.getUserMedia({
						audio: false,
						video: {
							facingMode: "environment",
							width: {
								ideal: 512
							},
							height: {
								ideal: 384
							}
						}
					})
					.then(function(stream) {
						video.srcObject = stream;
						var ctx = canvas.getContext('2d');
						var loop = (function() {
							if (this.codeScanned) {
								//video.stop();
								return;
							} else {
								ctx.drawImage(video, 0, 0);
								setTimeout(loop, 1000/30); // drawing at 30fps
								//qrcode.decode(canvas.toDataURL());
								var img=$("#img")[0];
								img.src=canvas.toDataURL();
								setTimeout(function(){
								canvas.width=img.naturalWidth;
								canvas.height=img.naturalHeight;
								//ctx.clearRect(0, 0, canvas.width, canvas.height);
								//ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
								this.decodePDF417(ctx,img);
								}.bind(this),10);
							}
						}.bind(this));
						loop();
					}.bind(this))
					.catch(function(error) {
						sap.m.MessageBox.error("Unable to get Video Stream");
					});

					container.getDomRef().appendChild(canvas);
				},
				decodePDF417:function(canvas_context,image){
					try {
			           var source = new ZXing.BitmapLuminanceSource(canvas_context, image);
			            var binarizer = new ZXing.Common.HybridBinarizer(source);
			            var bitmap = new ZXing.BinaryBitmap(binarizer);
			            var barCodeData=JSON.stringify(ZXing.PDF417.PDF417Reader.decode(bitmap, null, false), null, 4);
			            if(barCodeData){
			            	var data=JSON.parse(barCodeData);
			            	if(data.length>0 && this.codeScanned == false){
			            		this.codeScanned=true;
			            		MessageToast.show(barCodeData);
			            		this.dialog.close();
			            	}
			            }
			            MessageToast.show(barCodeData);
			           // this.codeScanned=true;
			        } catch (err) {
			            //MessageBox.show(err.message,"ERROR","Error");
			        	console.log(err.message);
			        }
				}
				//End of Controller
			});
	return Controller;
});
