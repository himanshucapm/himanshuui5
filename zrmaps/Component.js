sap.ui.define([ 'sap/ui/core/UIComponent', "com/musashi/scan/model/models" ], function(UIComponent, models) {
	"use strict";

	var Component = UIComponent.extend("com.musashi.scan.Component", {
		metadata : {
			manifest : "json"
		},

		init : function() {
			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		}
	});

	return Component;
});