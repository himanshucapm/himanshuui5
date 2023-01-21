jQuery.sap.declare("zretreadreport.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

zretreadreport.util.Formatter = {
	
		
		date1:function(oDate){
			
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);                       
		},
		
		      date: function(oDate){
		    	  if(oDate!=null && oDate!=""){

		      var sDate = new Date(oDate);
		      return sDate;
		    	  }else{
		    		  return null;
		    	  }

		      },
		      
		      repairIcon : function(Type){
					if(Type){
						if(Type === "R"){
							return "sap-icon://complete";
							}	
						if(Type === "N"){
							return "sap-icon://decline";
							}	
						}
					},
					
					repairColor : function(Color){
						if(Color){
							if(Color === "R"){
								return "#33cc33";
								}	
							if(Color === "N"){
								return "#ff0000";
								}	
							}
						},
};