
jQuery.sap.declare("zcrbroomappr.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zcrbroomappr.util.Formatter = {
	
		/*trimData: function(val){
			return val.trim();
		},*/

		date2:function(oDate){
		 
			     if (oDate == undefined)
			                     return "";
			     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
			                     pattern : "dd-MM-yyyy"
			     });
			     var sDate = new Date(oDate);
			     return oDateFormat.format(sDate);                       
			},

			
			//for Display Icon
			setIcon: function(Status){			
					 
					if(Status == "APPR"){
					return "sap-icon://employee-approvals"
					
					}
					   
					if(Status === "REJC"){
						return "sap-icon://employee-rejections";
					}
					
					if(Status === "SUBM"){
						return "sap-icon://pending";
					}
						
					if(Status === "ISSU"){
						return "sap-icon://approvals";
					}
					
					if(Status === "USED"){
						return "sap-icon://accept";
					}
			},
			
			 
			//for Status Icon Color
			setColor: function(Status){
				 
				if(Status == "APPR"){
					var color = "#31ae31";
					return color;
				}
				
				if(Status === "REJC"){
					var color = "#fa6135";
					return color;
				}
				
				if(Status === "SUBM"){
					var color = "#FFD700";
					return color;
				}
				
				if(Status === "ISSU"){
					var color = "#008000";
					return color;
				}
				
				if(Status === "USED"){
					var color = "#008000";
					return color;
				}
				
			},
			
			setIcon2: function(BuyFor){			
				 
				if(BuyFor == "S"){
				return "sap-icon://account"
				
				}
				   
				if(BuyFor === "O"){
					return "sap-icon://collaborate";
				}		
			},
			
			setColor2: function(BuyFor){
				 
				if(BuyFor == "S"){
					var color = "#dd6512";
					return color;
				}
				
				if(BuyFor === "O"){
					var color = "cornflowerblue";
					return color;
				}
				
			},
		
			
	
};