sap.ui.define([
               "sap/ui/core/UIComponent"
               ], function (UIComponent) {
  "use strict";

  return UIComponent.extend("com.jkt.ui.mybenefit.demo.app.Component", {

    metadata: {
      "version": "1.0.0",
      "rootView" : {
        "viewName":"com.jkt.ui.mybenefit.demo.app.view.BenefitView",
        type: sap.ui.core.mvc.ViewType.XML
      },
      "includes" : ["css/style.css"],
      "dependencies": {
        "libs": [
                 "sap.m",
                 "sap.ui.core",
                 "sap.ui.layout"
                 ]
      },

      "config": {
        "resourceBundle" : "i18n/messageBundle.properties",
        "serviceConfig": {
          "name": "BenefitsService",
          "serviceUrl": "/sap/opu/odata/sap/ZHRINSURANCE_SRV/"
        },
        "sample": {
          "stretch": true,
          "files": [
                    "BenefitView.view.xml",
                    "BenefitController.controller.js"
                    ]
        }
      }
    },

    init : function () {
      this.oDialog = new sap.m.BusyDialog({text:"Loading Data..."});

      var mConfig = this.getMetadata().getConfig();
      var oRootPath = jQuery.sap.getModulePath("com.jkt.ui.mybenefit.demo.app");

      // Set i18n model
      var i18nModel = new sap.ui.model.resource.ResourceModel({
        bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
      });
      this.setModel(i18nModel, "i18n");
      //oData Model
      var sPath=mConfig.serviceConfig.serviceUrl;//Keep this at the time of deployment
//      var sPath=this.addProxyToURL(mConfig.serviceConfig.serviceUrl);//Remove this at the time of deployment
      var oDataAppModel = new sap.ui.model.odata.ODataModel(sPath,{json:true,loadMetadatAsyn :true});
//      var oDataAppModel = new sap.ui.model.odata.ODataModel(sPath,true);
      this.setModel(oDataAppModel);
      UIComponent.prototype.init.apply(this, arguments);
      
      try{
    	  //**Modify the shell header hiding setings if it is running in FIORI LaunchPad**//
    	  var objShell = sap.ui.getCore().byId("shell");
    	  objShell.setHeaderHiding(false);
    	  objShell.setHeaderHidingDelay(0);
      }catch(notInFioriLaunchPad){}
    },

    /*
     * Remove the below method at the time of deployment
     */
        addProxyToURL : function(sServiceUrl){
          var sOrigin=window.location.protocol + "//" + window.location.hostname + "//" + (window.location.port? ":" + window.location.port: "");
          if(!jQuery.sap.startsWith(sServiceUrl,sOrigin)){
            return "proxy/" + sServiceUrl.replace("://","/");
      }else{
        return sServiceUrl.substring(sOrigin.length);
      }
        },
  });
});