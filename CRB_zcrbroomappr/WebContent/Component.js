jQuery.sap.declare("zempdashboard.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("zempdashboard.Component", {
       metadata : {
              "name" : "zempdashboard",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zempdashboard",
              "includes" : ["css/style.css"],
              "dependencies" : {
              "libs" : [ "sap.m", "sap.ui.layout" ],
              "components" : []
              },
              
              "config" : {
                  resourceBundle : "i18n/messageBundle.properties",
                  fullWidth:true,
                  serviceConfig : {
                  name: "",
                  }
           },
           
              routing : {
                     config : {
                           "routerClass" : "sap.m.routing.Router",
                           "viewType" : "XML",
                           "viewPath" : "zempdashboard.view",
                           "controlId" : "rootControl",
                           "controlAggregation" : "pages",
                           "targetControl" : "rootControl",
                           "transition": "flip",
                           "targetAggregation" : "pages",
                     },
                     routes : [
                               {
                                     pattern : "",
                                     name : "page1",
                                     target : "page1"
                               },
                     ],
                     targets : {
							page1 : {
								viewName : "View1",
								viewLevel : 1
			 				}
						}
              }
       },
       createContent : function() {
          var oViewData = { component : this };
          return sap.ui.view({
             viewName : "zempdashboard.view.App",
             type : sap.ui.core.mvc.ViewType.XML,
             viewData : oViewData
          });
       },
       init : function() {
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