
jQuery.sap.declare("zconfeapply.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zconfeapply.util.Formatter = {
	
		
		date1:function(oDate){
		     if (oDate == undefined){
		    	 return "";
		    	 }else{
		    		 var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	                     pattern : "dd-MM-YYYY"
		    		 	});
				     var sDate = new Date(oDate);
				     return sDate;
//				     return oDateFormat.format(sDate);                       
				}
		},
		
	

		      	
};