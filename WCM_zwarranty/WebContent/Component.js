jQuery.sap.declare("zwcminspec.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zwcminspec.Component", {
       metadata : {
              "name" : "zwcminspec",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zwcminspec",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              "config" : {
                     resourceBundle : "i18n/messageBundle.properties",
                     serviceConfig : {
                       name: "",
                      //serviceUrl: "../zwcminspec/proxy/sap/opu/odata/sap/ZCS_TICKET_SRV/?saml2=disabled"
                       //serviceUrl: "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/" 
                       serviceUrl: "/sap/opu/odata/sap/ZCS_TICKET_SRV/" 
                      
                     },
                                    
                     
              },
              routing : {
                     config : {
                           "viewType" : "XML",
                           "viewPath" : "zwcminspec.view",
                           "targetControl" : "fioriContent",
                           "targetAggregation" : "pages",
                           "clearTarget" : false
                     },
                     routes : [

                               {
                                     pattern : "",
                                     name : "S1",
                                     view : "S1"
                               }
                     ]
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             viewName : "zwcminspec.view.Main",
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
           
           var oRootPath = jQuery.sap.getModulePath("zwcminspec");   
           var i18nModel = new sap.ui.model.resource.ResourceModel({
   			 bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
   		   });    
   		   this.setModel(i18nModel, "i18n");
   		   
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
       }

   });