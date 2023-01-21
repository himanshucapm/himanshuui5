
jQuery.sap.declare("com.acute.zcreatetestplan.util.formatter");
com.acute.zcreatetestplan.util.formatter = {
	
		
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
		}
};