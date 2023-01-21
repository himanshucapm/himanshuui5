jQuery.sap.declare("zrmaps.util.formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zrmaps.util.Formatter = {
	
		
		checkFitmentPlanned:function(fitplan){
				return fitPlan; 
		},
		

		
		date1:function(oDate){
			debugger
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);                       
		},
		
		

		
		
		//for Display Icon
		setIcon: function(Status){			
				
				if(Status == "COMP"){
				return "sap-icon://status-completed"
				
				}
			
				/*if(Status === "APPR"){
					return "sap-icon://approvals";
				}*/
				
				if(Status === "CLSD"){
					return "sap-icon://decline";
				}
				
			/*	if(Status === "PAPP"){
					return "sap-icon://accept";
				}*/
				
				
			
		},
		 
		//for Status Icon Color
		setColor: function(Status){
			
			if(Status == "COMP"){
				var color = "#C7D94C";
				return color;
			}
			
			if(Status === "CLSD"){
				var color = "#e78c07";
				return color;
			}
			
/*			if(Status === "APPR"){
				var color = "#5dcc6a";
				return color;
			}
			
			if(Status === "PAPP"){
				var color = "#1AD3F9";
				return color;
			}
			if(Status == "CART"){
				var color = "#34352E";
				return color;
			}
			
			if(Status == "PAPR"){
				var color  = "#D94C4C";
				return color;
			}
			if(Status == "EDIT"){
				var color = "#DBF91A";
				return color;
			}
			if(Status == "PACT"){
				var color = "#1AD3F9";
				return color;
			}*/
		},
		

		
};