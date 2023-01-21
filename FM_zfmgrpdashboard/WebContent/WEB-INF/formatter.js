
jQuery.sap.declare("zinspectionfm.util.formatter");
zinspectionfm.util.formatter = {
	
		
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
		
///////////////////////////////////Using formatter in contract type //////////////////////////////////////////
	
		ContractType: function(contractType){
			if(contractType){
				if(contractType === "CPKM"){
					return "Contract par kilo meter";
				}
				if(contractType === "SC"){
					return "Service Contract";
				}
			}
		},
		
////////////////////////////////////////////////////////////////////////////		
		cart:function(val){
			
			if(val == "X"){
				return "sap-icon://cart";
			}
			
			if(val == "" || val == undefined){
				return "";
			}
		},
		
		
		
		//for Display Icon
		setIcon: function(contractType){
			if(contractType){
				if(contractType === "CPKM"){
					return "sap-icon://inventory";
				}
				if(contractType === "SC"){
					return "sap-icon://settings";
				}
			}
		},
		 
		//for Status Icon Color
		setColor: function(contractType){
			if(contractType === "CPKM"){
				var color = "#1C4C98";
				return color;
			}
			if(contractType === "SC"){
				var color = "#031E48";
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