jQuery.sap.declare("com.acute.ticketZSC.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
com.acute.ticketZSC.util.Formatter = {
	
		date:function(oDate){
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     return oDateFormat.format(oDate);
		},


		 time:function(oDate){
			 if (oDate == undefined)
                 return "";
			var duhrs =oDate.ms;
		    if (duhrs == undefined)
		    	return "";
		     
			var date = new Date(duhrs);
			var str = '';
			
			if(date.getUTCHours()<10){
				str += date.getUTCHours() + ":";
			}
			else{
				str += date.getUTCHours() + ":";
			}
			
			
			if(date.getUTCMinutes()<10){
				str += "0" + date.getUTCMinutes() + ":";
			}
			else{
				str += date.getUTCMinutes() + ":";
			}
			if(date.getUTCSeconds()<10){
				str += "0" + date.getUTCSeconds();
			}
			else{
				str += date.getUTCSeconds();
			}
		     return str;
		},

		datetemp : function(value) {
		
			var temp = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd/MM/yyyy HH:mm"});
		    return temp.format(value);;
			
			//var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddT00:00:00.0000000"});
			//that_QM.oFromDate=oDateFormat.format(that_QM.sFrom);

		},
		cat : function(value,value1) {
			
			if(value==""){
				var cat=value;
				return cat;
			}
			else if(value1==""){
				var cat=value1;
				return cat;
			}
			else{
				var cat=value+"("+value1+")";
			    return cat;
			}
				//var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddT00:00:00.0000000"});
				//that_QM.oFromDate=oDateFormat.format(that_QM.sFrom);

			},
	
};