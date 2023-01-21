jQuery.sap.declare("zesepaapprove.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("zesepaapprove.Component", {
       metadata : {
              "name" : "zesepaapprove",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zesepaapprove",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              "config" : {
                     serviceConfig : {
                       name: "",
//                       serviceUrl: "/sap/opu/odata/sap/ZCS_TICKET_SRV/"   
                     }
              },
              routing : {
                     config : {
                    	 "routerClass" : "sap.m.routing.Router",
//                    	 	"rootView" : "zesepaapprove.view.App",
                           "viewType" : "XML",
                           "viewPath" : "zesepaapprove.view",
                           "controlId" : "rootControl",
                           "controlAggregation" : "pages",
                           "targetControl" : "rootControl",
                           "targetAggregation" : "pages",
                           
                     },
                     routes : [
                               {
                                     pattern : "",
                                     name : "page1",
                                     target : "page1"
                               },
                               {
                                   pattern : "page2/{entity}",
                                   name : "page2",
                                   target : "page2"
                               },
                               {
                                   pattern : "page3/{entity}",
                                   name : "page3",
                                   target : "page3"
                               },
                               {
                                   pattern : "page4/{entity}",
                                   name : "page4",
                                   target : "page4"
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
							},
							page4 : {
								viewName : "View4",
								viewLevel : 4
							}
						}
                     
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             viewName : "zesepaapprove.view.App",
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