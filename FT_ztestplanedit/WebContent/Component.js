jQuery.sap.declare("zdealerclaimrep.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
sap.ui.core.UIComponent.extend("zdealerclaimrep.Component", {
       metadata : {
              "name" : "zdealerclaimrep",
//              "url":"/sap/bc/ui5_ui5/sap/zdealerclaimrep",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zdealerclaimrep",
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
//                           "viewPath" : "zdealerclaimrep.view",
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
							viewPath : "zdealerclaimrep.view",
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
                               },{
									name : "View2",
									pattern : "View2/{entity}",
									target : "View2"
								},{
									name : "ClaimView",
									pattern : "ClaimView/{entity}",
									target : "ClaimView"
								},{
									name : "Inspection",
									pattern : "Inspection/{entity}",
									target : "Inspection"
								},
								
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
							ClaimView : {
								viewName : "ClaimView",
								viewLevel : 3
							},
							Inspection : {
								viewName : "Inspection",
								viewLevel : 4
							},
						}
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             /*viewName : "zdealerclaimrep.view.View1",*/
        	  viewName : "zdealerclaimrep.view.App",
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
           
           var oRootPath = jQuery.sap.getModulePath("zdealerclaimrep");   
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