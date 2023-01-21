
jQuery.sap.declare("zexposeapprove.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zexposeapprove.util.Formatter = {
	
		/*trimData: function(val){
			return val.trim();
		},*/

		date1:function(oDate){
		 
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
					 
					if(Status == "A"){
					return "sap-icon://employee-approvals"
					
					}
					   
					if(Status === "R"){
						return "sap-icon://employee-rejections";
					}
					
					if(Status === ""){
						return "sap-icon://pending";
					}
						
				
			},
			
			 
			//for Status Icon Color
			setColor: function(Status){
				 
				if(Status == "A"){
					var color = "#31ae31";
					return color;
				}
				
				if(Status === "R"){
					var color = "#fa6135";
					return color;
				}
				
				if(Status === ""){
					var color = "#FFD700";
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