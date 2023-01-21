jQuery.sap.declare("zftplanreport.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zftplanreport.Component", {
       metadata : {
              "name" : "zftplanreport",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zftplanreport",
              "includes" : [""],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              "config" : {
                     serviceConfig : {
                       name: "",
                       serviceUrl: "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/"   
                     }
              },
              routing : {
                     config : {
                    	 	routerClass : "sap.m.routing.Router",
                           viewType : "XML",
                           viewPath : "zftplanreport.view",
                           controlAggregation : "pages",
                           controlId : "rootControl",
                           transition: "slide",
                           clearControlAggregation : "false",
                           async : "true"
                     },
                     routes : [

                               {
                                     pattern : "",
                                     name : "S1",
                                     view : "S1"
                               },
                               {
									name : "S2",
									pattern : "S2/{entity}",
									target : "S2"
								},
								{
									name : "InspView",
									pattern : "InspView/{entity}",
									target : "InspView"
								},
                     ],
                     targets : {
							page1 : {
								viewName : "S1",
								viewLevel : 1
			 				},
			 				S2 : {
								viewName : "S2",
								viewLevel : 2
			 				},
			 				InspView : {
								viewName : "InspView",
								viewLevel : 3
			 				},
						}
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             viewName : "zftplanreport.view.App",
             type : sap.ui.core.mvc.ViewType.XML,
             viewData : oViewData
          });
       },
       init : function() {
           sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
           var mConfig = this.getMetadata().getConfig();
           var sServiceUrl = mConfig.serviceConfig.serviceUrl;
           var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
           oModel.setDefaultCountMode((sap.ui.model.odata.CountMode.None));
           oModel.attachMetadataFailed(function(){
                  this.getEventBus().publish("Component", "MetadataFailed");
           },this);
           this.setModel(oModel);
           var deviceModel = new sap.ui.model.json.JSONModel({
                  isTouch : sap.ui.Device.support.touch,
                  isNoTouch : !sap.ui.Device.support.touch,
                  isPhone : sap.ui.Device.system.phone,
                  isNoPhone : !sap.ui.Device.system.phone,
                  listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                               listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
           });
           deviceModel.setDefaultBindingMode("OneWay");  
   		   
           this.setModel(deviceModel, "device");
           this.getRouter().initialize();
       },
       exit : function() {
          // this._routeMatchedHandler.destroy();
       },
       setRouterSetCloseDialogs : function(bCloseDialogs) {
           this._bRouterCloseDialogs = bCloseDialogs;
           if (this._routeMatchedHandler) {
               this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
           }
       },

       _initODataModel : function(sServiceUrl) {
           var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
           oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
           this.setModel(oModel);
       },
       
       getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

   });