jQuery.sap.declare("zrmaps.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zrmaps.Component", {
       metadata : {
              "name" : "zrmaps",
//              "url":"/sap/bc/ui5_ui5/sap/zrmaps",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zrmaps",
              "includes" : ["css/style1.css"],
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
            	  
                    /* config : {
                           "viewType" : "XML",
                           "viewPath" : "zrmaps.view",
                           "targetControl" : "fioriContent",
                           "targetControl" : "rootControl",
                           "targetAggregation" : "pages",
                           "clearTarget" : false
                     },*/
            	  
            	  config : {
						"routerClass" : "sap.m.routing.Router",
						"viewPath" : "zrmaps.view",
						"controlId" : "rootControl",
						//targetControl : "fioriContent",
						"controlAggregation" : "pages",
						"transition": "slide",
						"viewType" : "XML"
					},
                     
                     routes : [

                               {
                                     pattern : "",
                                     name : "View1",
                                     view : "View1"
                               },
                               
                               {
                            	   name : "View2",
                            	   pattern : "View2/{entity}",
                            	   target : "View2"
                               },
                               {
                            	   name : "View3",
                            	   pattern : "View3/{entity}",
                            	   target : "View3"
                               },
                               {
                            	   name : "View4",
                            	   pattern : "View4/{entity}",
                            	   target : "View4"
                               },
                               {
                            	   name : "View5",
                            	   pattern : "View5/{entity}",
                            	   target : "View5"
                               },
                               {
                            	   name : "Reading",
                            	   pattern : "Reading/{entity}",
                            	   target : "Reading"
                               },
                               {
                            	   name : "S1",
                            	   pattern : "S1/{entity}",
                            	   target : "S1"
                               },
                               {
                            	   name : "masterDetail",
                            	   pattern : "masterDetail/{entity}",
                            	   target : "masterDetail"
                               },
                               {
                            	   name : "SalesOrder",
                            	   pattern : "SalesOrder",
                            	   target : "SalesOrder"
                               },
                               
                               {
                            	   name : "BindingTypes",
                            	   pattern : "BindingTypes",
                            	   target : "BindingTypes"
                               },
                               
                               {
                            	   name : "Pagging",
                            	   pattern : "Pagging",
                            	   target : "Pagging"
                               }
                     ],
                     
                     targets : {
							page1 : {
								viewName : "View1",
								viewLevel : 1
			 				},
			 				View2 : {
								viewName : "View2",
								viewLevel : 2
							},
							View3 : {
								viewName : "View3",
								viewLevel : 3
							},
							View4 : {
								viewName : "View4",
								viewLevel : 4
							},
							View5 : {
								viewName : "View5",
								viewLevel : 5
							},
							Reading : {
								viewName : "Reading",
								viewLevel : 6
							},
							S1 : {
								viewName : "S1",
								viewLevel : 7
							},
							masterDetail : {
								viewName : "masterDetail",
								viewLevel : 8
							},
							
							SalesOrder : {
								viewName : "SalesOrder",
								viewLevel : 9
							},
							
							BindingTypes : {
								viewName : "BindingTypes",
								viewLevel : 10
							},
							
							Pagging : {
								viewName : "Pagging",
								viewLevel : 11
							},
							
						}
                     
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             /*viewName : "zrmaps.view.View1",*/
        	  viewName : "zrmaps.view.App",
             type : sap.ui.core.mvc.ViewType.XML,
             viewData : oViewData
          });
       },
       init : function() {
           sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
           var mConfig = this.getMetadata().getConfig();
//           var sServiceUrl = mConfig.serviceConfig.serviceUrl;
//           var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
//           oModel.setDefaultCountMode((sap.ui.model.odata.CountMode.None));
//           oModel.attachMetadataFailed(function(){
//                  this.getEventBus().publish("Component", "MetadataFailed");
//           },this);
//           this.setModel(oModel);
           var deviceModel = new sap.ui.model.json.JSONModel({
                  isTouch : sap.ui.Device.support.touch,
                  isNoTouch : !sap.ui.Device.support.touch,
                  isPhone : sap.ui.Device.system.phone,
                  isNoPhone : !sap.ui.Device.system.phone,
                  listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                               listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
           });
           deviceModel.setDefaultBindingMode("OneWay");  
           
           var oRootPath = jQuery.sap.getModulePath("zrmaps");   
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