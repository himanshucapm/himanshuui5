
jQuery.sap.declare("zclaimstachart.util.formatter");
zclaimstachart.util.formatter = {
	
		
		checkFitmentPlanned:function(fitplan){
				return fitPlan; 
		},
		
		convertDate:function(date){
			debugger
			if(date){
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyyy" });   
				var dateFormatted = dateFormat.format(date);
				return dateFormatted;
			}else{
				return "";
			}
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
		
		yesNo:function(val){
			if(val == "Y"){
				return "Yes";
			}
			if(val == "N"){
				return "No";
			}
		},
		
		cart:function(val){
			
			if(val == "X"){
				return "sap-icon://cart";
			}
			
			if(val == "" || val == undefined){
				return "";
			}
		},
		
		
		//for Display Icon
		setIcon: function(Status){
			
			
	/*		switch(Status){
				case 1 : "PAPR"
				return "sap-icon://employee-approvals";
				
				case 2 : "PAPP"
				return "sap-icon://employee-approvals";
				
				case 3 : "AUTH"
					return "sap-icon://employee-approvals";
				case 4 : "APPR"
					return "sap-icon://employee-approvals";
				case 5 : "CLSD"
					return "sap-icon://employee-approvals";
				case 6 : "HOLD"
					return "sap-icon://employee-approvals";
				case 6 : "EDIT"
					return "sap-icon://employee-approvals";		
				
			}
		},*/
			
			
			if(Status){
				if(Status === "PAPR"){
					return "sap-icon://employee-approvals";
				}
				if(Status === "PAPP"){
					return "sap-icon://employee-approvals";
				}
				if(Status === "AUTH"){
					return "sap-icon://employee-approvals";
				}
				if(Status === "APPR"){
					return "sap-icon://complete";
				}
				if(Status === "CLSD"){
					return "sap-icon://decline";
				}
				if(Status === "HOLD"){
					return "sap-icon://documents";
				}
				if(Status === "EDIT"){
					return "sap-icon://synchronize";
				}
			}
		},
		 
		//for Status Icon Color
		setColor: function(Status){
			
			if(Status === "PAPP"){
				var color = "#e78c07";
				return color;
			}
			
			if(Status === "PAPR"){
				var color = "#e78c07";
				return color;
			}
			if(Status === "AUTH"){
				var color = "#2b7d2b";
				return color;
			}
			
			if(Status === "APPR"){
				var color = "#2b7d2b";
				return color;
			}
			
			if(Status === "CLSD"){
				var color = "#e78c07";
				return color;
			}
			if(Status === "HOLD"){
				var color = "#e78c07";
				return color;
			}
			if(Status === "EDIT"){
				var color = "#e78c07";
				return color;
			}
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