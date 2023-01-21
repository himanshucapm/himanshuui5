jQuery.sap.declare("zssvehdata.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zssvehdata.util.Formatter = {
	
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