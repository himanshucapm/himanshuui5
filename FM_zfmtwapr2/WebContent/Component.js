jQuery.sap.declare("zretreaddboard.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");


/*sap.ui.define(["zretreaddboard.Component","sap.ui.core.UIComponent","sap.ui.core.routing.History","sap.m.routing.RouteMatchedHandler"],

 function (Component,UIComponent,History,RouteMatchedHandler) {*/
	

sap.ui.core.UIComponent.extend("zretreaddboard.Component", {
       metadata : {
              "name" : "zretreaddboard",
//              "url":"/sap/bc/ui5_ui5/sap/zretreaddboard",
              "version" : "1.1.0-SNAPSHOT",
              "library" : "zretreaddboard",
              "includes" : ["css/style.css"],
              "dependencies" : {
                     "libs" : [ "sap.m", "sap.ui.layout" ],
                     "components" : []
              },
              
              
              "config" : {
            	 fullWidth:false,
                     resourceBundle : "i18n/messageBundle.properties",
                     /*serviceConfig : {
                       name: "",
                     }*/
              },
              
              
              routing : {
            	  
                     config : {
							routerClass : "sap.m.routing.Router",
							viewPath : "zretreaddboard.view",
							controlId : "rootControl",
							controlAggregation : "pages",
							transition: "slide",
							viewType : "XML"
						},
						//view : "View1",
                 
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
             /*viewName : "zretreaddboard.view.View1",*/
        	  viewName : "zretreaddboard.view.App",
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
           
           var oRootPath = jQuery.sap.getModulePath("zretreaddboard");   
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