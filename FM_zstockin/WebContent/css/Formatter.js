
jQuery.sap.declare("zstockreport.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zstockreport.util.Formatter = {
	
		trimData: function(val){
			return val.trim();
		},
	
	//	pattern : "MM.dd.yyyy"
		date1:function(oDate){
			
			     if (oDate == undefined)
			                     return "";
			     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
			                     pattern : "dd-MM-yyyy"
			     });
			     var sDate = new Date(oDate);
			     return oDateFormat.format(sDate);                       
			},
			 	
};