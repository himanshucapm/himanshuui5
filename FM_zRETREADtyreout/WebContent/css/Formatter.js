
jQuery.sap.declare("zsstrndata.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zsstrndata.util.Formatter = {
	
		trimData: function(val){
			return val.trim();
		},
		date1:function(oDate){
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);                       
		},
		Code:function(val1,val2){
			if(val1==""&&val2==""){
				return "";
			}else{
			return val1+" ("+val2+")"
			}
		},
		
		INRValue: function(val){
		    	  if(val == null || val == ""){
		    		  return "false";
		    	  }else{
		    		  return "true";
		    	  }
		      },
		      costFormat:function(cost){
		    	  if(cost){
		    		  cost = parseFloat(cost).toFixed(2);
		    		  return cost +" INR";
		    	  }else{
		    		  return cost;
		    	  }
		      }
};