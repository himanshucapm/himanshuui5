
jQuery.sap.declare("ZVEHICLE.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
ZVEHICLE.util.Formatter = {
	
		
		date1:function(oDate){
		     if (oDate == undefined || oDate == "")
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);                       
		},
		
		reasonText:function(v){
			
			if(v == "N"){
				return true;
			}else{
				return false;
			}
			
		},
		
		 srvsType : function(v){
			 
			 if(v == "SC"){
				 v = "Service Contract";
			 }else if(v == "CPKM"){
				 v = "Charge Per KM"
			 }else if(v == "NONE"){ //changes by amit on 05-08-2019
				 v = "None"
			 }
			 
		/*	 else{
				 if(v == "CPKM"){
					 v = "Charge Per KM"
				 }else{
					 v = "NONE";
				 } 
			 }*/
			 
			 return v;
			 
		 },
		  mechCond: function(v){
			  if(v == "N"){
				  v = "Not OK"
			  }else{
				  if(v == "Y"){
					  v = "OK";
				  }else{
					  v = "";
				  }
			  }
			  
			  return v;
			  
		  },
		  
		  contractDropDownSC : function(v){
			  
			  if(v == "SC"){
				  return false;
			  }else{
				  return true;
			  }
			  
		  },
		  contractDropDownCPKM : function(v){
			  
			  if(v == "CPKM"){
				  return false;
			  }else{
				  return true;
			  }
			  
		  }
		
			
};