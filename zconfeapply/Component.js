sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zfieldplanrepor/model/models",
	"sap/ui/core/routing/History",
	"sap/m/routing/RouteMatchedHandler"

], function (UIComponent, Device, models) {
	"use strict";
	return UIComponent.extend("zfieldplanrepor.Component", {
	
		metadata: {
			manifest: "json"
		},
		
		
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function (){
			//call the base componet's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			//enable routing
			this.getRouter().initialize();
			
			//set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});