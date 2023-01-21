
jQuery.sap.declare("zesepaapprove.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zesepaapprove.util.Formatter = {
	
		trimData: function(val){
			return val.trim();
		},

		date2:function(oDate){
		
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
	
			/*	sap-icon://validate    			(Pending for Action)
				sap-icon://pending     			(In Process)
				sap-icon://complete    			(Completed)
				sap-icon://employee-rejections  (Withdrawn)*/
			
			setIcon : function(ResStatus){
					debugger
					if(ResStatus){
						if(ResStatus === "01"){
							return "sap-icon://validate";
							}
						if(ResStatus === "02"){
							return "sap-icon://pending";
						}
						if(ResStatus === "03"){
							return "sap-icon://complete";
							}							
						if(ResStatus === "04"){
							return "sap-icon://employee-rejections";
						}
						
					}
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
		//for Status Icon Color
				setColor : function(ResStatus){
				
					if(ResStatus === "01"){
						var color = "#e78c07";
						return color;
					}
					if(ResStatus === "02"){
						var color = "#e78c07";
						return color;
					}
					if(ResStatus === "03"){
						var color = "#2b7d2b";
						return color;
						
					}
					if(ResStatus === "04"){
						var color = "#bb0000";
						return color;
					}
					
				},
				
	
		date : function(oDate){
			
			     if (oDate == undefined || oDate == "")
			         return "";
			     
			var date  = oDate.split("-");
			date[2]   = date[2].slice(0,2);
			var final = date[2]+"-"+date[1]+"-"+date[0];
			return final;
			     
			},
};