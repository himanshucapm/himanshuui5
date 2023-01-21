
jQuery.sap.declare("ztestplanedit.util.formatte");
ztestplanedit.util.formatte = {
	
		
		checkFitmentPlanned:function(fitplan){
				return fitPlan; 
		},
		convertDate:function(date){
			if(date){
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyyy" });
				var dateFormatted = dateFormat.format(date);
				return dateFormatted;
			}else{
				return "";
			}
		},
		
		
		//for Display Icon
		setIcon: function(status){
			
			if(status){
				if(status === "PAPR"){
					return "sap-icon://employee-approvals";
				}
				if(status === "PAPP"){
					return "sap-icon://employee-approvals";
				}
				if(status === "AUTH"){
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
				if(status === "HSUB"){
					return "sap-icon://documents";
				}
				if(status === "EDIT"){
					return "sap-icon://synchronize";
				}
			}
		},
		 
		//for Status Icon Color
		setColor: function(status){
			if(status === "PAPP"){
				var color = "#e78c07";
				return color;
			}
			
			if(status === "PAPR"){
				var color = "#e78c07";
				return color;
			}
			if(status === "AUTH"){
				var color = "#2b7d2b";
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
			if(status === "HOLD" || status === "HSUB"){
				var color = "#e78c07";
				return color;
			}
			if(status === "EDIT"){
				var color = "#e78c07";
				return color;
			}
		},
		
};
