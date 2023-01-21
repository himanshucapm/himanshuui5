sap.ui.define([ "com/musashi/scan/controller/BaseController", "sap/ui/model/json/JSONModel" ], function(BaseController, JSONModel) {
    "use strict";

    var Controller = BaseController.extend("com.musashi.scan.controller.App", {
	onInit : function() {
	    var oViewModel = new JSONModel({
		busy : false,
		delay : 0
	    })
	}
    });

    return Controller;
});
