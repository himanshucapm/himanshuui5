
jQuery.sap.declare("ZHrApprove.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
ZHrApprove.util.Formatter = {
	
		trimData: function(val){
			return val.trim();
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
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		//for Display Icon
				setIcon : function(status){
						debugger
					if(status){
						if(status === "A"){
							return "sap-icon://approve";
						}
						if(status === "H"){
							return "sap-icon://hold";
						}
						if(status === "R"){
							return "sap-icon://decline";
						}
						
					}
					
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
		//for Status Icon Color
				setColor : function(status){
					debugger
					
					if(status === "A"){
						var color = "#2b7d2b";
						return color;
					}			
								
					if(status === "R"){
						var color = "#ff0000";
						return color;
					}			
					if(status === "E"){
						var color = "#e78c07";
						return color;
					}
					
				},
				
	
		date : function(oDate){
			debugger
			     if (oDate == undefined || oDate == "")
			         return "";
			     
			var date  = oDate.split("-");
			date[2]   = date[2].slice(0,2);
			var final = date[2]+"-"+date[1]+"-"+date[0];
			return final;
			     
			},
};