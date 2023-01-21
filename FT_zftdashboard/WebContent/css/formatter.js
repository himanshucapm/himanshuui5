jQuery.sap.declare("zftdocmaster.util.formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zftdocmaster.util.Formatter = {
	
		
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
		
		
		//for Display Test Request Icon
		setReqIcon: function(status){
			debugger
			if(status){
				if(status === "PAPR"){
					return "sap-icon://employee-approvals";
				}
				if(status === "PACT"){
					return "sap-icon://employee-approvals";
				}
				if(status === "APPR"){
					return "sap-icon://complete";
				}
				if(status === "CLSD" || status === "SHCL"){
					return "sap-icon://decline";
				}
				if(status === "HOLD"){
					return "sap-icon://documents";
				}
				if(status === "EDIT"){
					return "sap-icon://synchronize";
				}
				if(status === "CART"){
					return "sap-icon://cart";
				}
			}
			
		},
		
		//for Status Icon Color
		setReqColor: function(status){
			if(status === "PAPR"){
				var color = "#617d96";
				return color; 
			}
			
			if(status === "PACT"){
				var color = "#e78c07";
				return color;
			}
			
			if(status === "APPR"){
				var color = "#2b7d2b";
				return color;
			}
			
			if(status === "CLSD" || status === "SHCL"){
				var color = "#e78c07";
				return color;
			}
			if(status === "HOLD"){
				var color = "#e78c07";
				return color;
			}
			if(status === "EDIT"){
				var color = "#e78c07";
				return color;
			}
			if(status === "CART"){
				var color = "#3676d7";
				return color;
			}
			
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
		
		setIconFitStatus: function(FitStatus){
			
			
			if(FitStatus === ""){
				return "sap-icon://process";
			}
			if(FitStatus === "X"){
				return "sap-icon://decline"; 
			}
		
	},
	
	setColorFitStatus: function(FitStatus){
		
		if(FitStatus === ""){
			var color = "#e78c07";
			return color;
		}
		
		if(FitStatus === "X"){
			var color = "#5dcc6a";
			return color;
		}
		
	},

		
};