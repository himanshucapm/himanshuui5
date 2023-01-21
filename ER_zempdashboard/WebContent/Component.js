
jQuery.sap.declare("zeseparation.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zeseparation.Component", {
       metadata : {
              "name" : "zeseparation",
//              "url":"/sap/bc/ui5_ui5/sap/zeseparation",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zeseparation",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
             
            
              config : {
		        	/* Adding the service configuration for OData URI */
            	  resourceBundle : "i18n/messageBundle.properties",
		        	serviceConfig : {
		                name : "SOTC",
		                serviceUrl : "/sap/opu/odata/sap/ZER_SEPERATION_SRV/"
		            }
		        },
              
              
              /*
              routing : {
                     config : {
                           "viewType" : "XML",
                           "viewPath" : "zeseparation.view",
                           "targetControl" : "fioriContent",
                           "targetControl" : "rootControl",
                           "targetAggregation" : "pages",
                           "clearTarget" : false
                     },
                     routes : [
                    	 		{
                                     pattern : "",
                                     name : "View1",
                                     view : "View1"
                               },
                               {
                                   pattern : "",
                                   name : "View2",
                                   view : "View2"
                               }
                     ],
                     targets : {
							page1 : {
								viewName : "View1",
								viewLevel : 1
			 						},
							page2 : {
								viewName : "View2",
								viewLevel : 2
									},
                     		}
              		}*/
		        routing : {
                    config : {
							routerClass : "sap.m.routing.Router",
							viewPath : "zeseparation.view",
							controlId : "rootControl",
							controlAggregation : "pages",
							transition: "flip",
							viewType : "XML",
							targetAggregation : "pages"
						},
                    routes : [ 
                   	 {
								name : "page1",
								pattern : "",
								target : "page1"
									},
							{
								name : "page2",
								pattern : "page2/{entity}",
								target : "page2"
									},
							{
								name : "page3",
								pattern : "page3/{entity}",
								target : "page3"
									}
								],
		             targets : {
								page1 : {
									viewName : "View1",
									viewLevel : 1
				 				},
								page2 : {
									viewName : "View2",
									viewLevel : 2
								},
								page3 : {
									viewName : "View3",
									viewLevel : 3
								}
					}
                  	 }  
		        
		        
		        
       			},
       			
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             /*viewName : "zeseparation.view.View1",*/
        	  viewName : "zeseparation.view.App",
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
           
           var oRootPath = jQuery.sap.getModulePath("zeseparation");   
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