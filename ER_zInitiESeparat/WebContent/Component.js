jQuery.sap.declare("zfmgrpdashboard.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");


/*sap.ui.define(["zfmgrpdashboard.Component","sap.ui.core.UIComponent","sap.ui.core.routing.History","sap.m.routing.RouteMatchedHandler"],

 function (Component,UIComponent,History,RouteMatchedHandler) {*/
	

sap.ui.core.UIComponent.extend("zfmgrpdashboard.Component", {
       metadata : {
              "name" : "zfmgrpdashboard",
//              "url":"/sap/bc/ui5_ui5/sap/zfmgrpdashboard",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zfmgrpdashboard",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              
              
              "config" : {
                     resourceBundle : "i18n/messageBundle.properties",
                     /*serviceConfig : {
                       name: "",
                     }*/
              },
              
              
              routing : {
            	  
                     config : {
							routerClass : "sap.m.routing.Router",
							viewPath : "zfmgrpdashboard.view",
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
             /*viewName : "zfmgrpdashboard.view.View1",*/
        	  viewName : "zfmgrpdashboard.view.App",
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
           
           var oRootPath = jQuery.sap.getModulePath("zfmgrpdashboard");   
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

   /*});*/

});