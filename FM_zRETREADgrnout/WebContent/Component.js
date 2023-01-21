jQuery.sap.declare("zretreadrepair.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zretreadrepair.Component", {
       metadata : {
    	   		 "name" : "zretreadrepair",
              "version" : "1.1.0-SNAPSHOT",
             "library"  : "zretreadrepair",
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
                     config : {
                           "viewType" : "XML",
                           "viewPath" : "zretreadrepair.view",
                           /*"targetControl" : "fioriContent",*/
                           "targetControl" : "appid",
                           "targetAggregation" : "pages",
                           "clearTarget" : false
                     },
                     routes : [
                    	 		{
                                     pattern : "",
                                     name : "View1",
                                     view : "View1"
                    	 		}
                    	 	  ]
                     
                 /*    targets : {
							page1 : {
								viewName : "View1",
								viewLevel : 1
			 				}
                     }*/
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
              viewName : "zretreadrepair.view.App",
              	  type : sap.ui.core.mvc.ViewType.XML,
              viewData : oViewData
          });
       },
       
           init: function(){
           sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
           var mConfig = this.getMetadata().getConfig();
           var deviceModel = new sap.ui.model.json.JSONModel({
                  	isTouch : sap.ui.Device.support.touch,
                  isNoTouch : !sap.ui.Device.support.touch,
                  	isPhone : sap.ui.Device.system.phone,
                  isNoPhone : !sap.ui.Device.system.phone,
                   listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                               listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
           });
           deviceModel.setDefaultBindingMode("OneWay");  
           var oRootPath = jQuery.sap.getModulePath("zretreadrepair");   
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