jQuery.sap.declare("zcrbroomapply.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zcrbroomapply.Component", {
       metadata : {
              "name" : "zcrbroomapply",
//              "url":"/sap/bc/ui5_ui5/sap/zcrbroomapply",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zcrbroomapply",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              "config" : {
                     resourceBundle : "i18n/messageBundle.properties",
                     serviceConfig : {
                       name: "",
                     }
              },
              routing : {
//                     config : {
//                           "viewType" : "XML",
//                           "viewPath" : "zcrbroomapply.view",
//                           /*"targetControl" : "fioriContent",*/
//                          // "targetControl" : "rootControl",
//                           //"targetAggregation" : "pages",
//                           //"clearTarget" : false
//                           controlAggregation : "pages",
//                           controlId : "rootControl",
//                           transition: "slide",
//                     },
                     config : {
							routerClass : "sap.m.routing.Router",
							viewPath : "zcrbroomapply.view",
							controlId : "rootControl",
							controlAggregation : "pages",
							transition: "slide",
							viewType : "XML"
						},
                     routes : [

                               {
                                     pattern : "",
                                     name : "View1",
                                     view : "View1"
                               }
								
                     ],
                     targets : {
							page1 : {
								viewName : "View1",
								viewLevel : 1
			 				},
			 				
						}
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             /*viewName : "zcrbroomapply.view.View1",*/
        	  viewName : "zcrbroomapply.view.App",
             type : sap.ui.core.mvc.ViewType.XML,
             viewData : oViewData
          });
       },
       init : function() {
           sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
           var mConfig = this.getMetadata().getConfig();


          /* var sServiceUrl = mConfig.serviceConfig.serviceUrl;
           var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
           oModel.setDefaultCountMode((sap.ui.model.odata.CountMode.None));
           oModel.attachMetadataFailed(function(){
                  this.getEventBus().publish("Component", "MetadataFailed");
           },this);
           this.setModel(oModel);*/
           
           
           var deviceModel = new sap.ui.model.json.JSONModel({
                  isTouch : sap.ui.Device.support.touch,
                  isNoTouch : !sap.ui.Device.support.touch,
                  isPhone : sap.ui.Device.system.phone,
                  isNoPhone : !sap.ui.Device.system.phone,
                  listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                               listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
           });
           deviceModel.setDefaultBindingMode("OneWay");  
           
           var oRootPath = jQuery.sap.getModulePath("zcrbroomapply");   
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
       

   });