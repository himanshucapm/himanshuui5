
jQuery.sap.declare("com.acute.ztestplancart.util.formatte");
com.acute.ztestplancart.util.formatte = {
	
		
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