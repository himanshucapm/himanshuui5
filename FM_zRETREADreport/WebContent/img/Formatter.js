
jQuery.sap.declare("zretreadtyreout.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zretreadtyreout.util.Formatter = {
	
		
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
//		        var sFinalDate = oDate;
//		        var sFinalNumber = sFinalDate.replace(/[^0-9]+/g,'' );
//		        var iFinalNumber = sFinalNumber * 1; //trick seventeen
//		        sFinalDate = new Date(iFinalNumber);
//		        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
//		        pattern: "yyyy-MM-dd'T'HH:mm:ss"
//		      });
		      var sDate = new Date(oDate);
		      return sDate;
		    	  }else{
		    		  return null;
		    	  }

		      }	 	
};