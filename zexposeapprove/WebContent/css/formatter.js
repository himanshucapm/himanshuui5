
jQuery.sap.declare("zinspreport.util.formatter");
zinspreport.util.formatter = {
	
		
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
				if(Status === "01"){
					return "sap-icon://pending";
				}
				if(Status === "02"){
					return "sap-icon://pending";
				}
				if(Status === "06"){
					return "sap-icon://decline";
				}
				if(Status === "07"){
					return "sap-icon://accept";
				}
				if(Status === "09"){
					return "sap-icon://accept";
				}
				if(Status === "11"){
					return "sap-icon://pending";
				}
				if(Status === "12"){
					return "sap-icon://pending";
				}
			}
		},
		 
		//for Status Icon Color
		setColor: function(Status){
			
			if(Status === "01"){
				var color = "#e09007";
				return color;
			}
			
			if(Status === "02"){
				var color = "#8b41f4";
				return color;
			}
			if(Status === "06"){
				var color = "#e00822";
				return color;
			}
			
			if(Status === "07"){
				var color = "#2b7d2b";
				return color;
			}
			
			if(Status === "09"){
				var color = "#e78c07";
				return color;
			}
			if(Status === "11"){
				var color = "#d641f4";
				return color;
			}
			if(Status === "12"){
				var color = "#b2374b";
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