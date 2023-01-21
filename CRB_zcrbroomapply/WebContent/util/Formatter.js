
jQuery.sap.declare("zclearancefrm.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zclearancefrm.util.Formatter = {
	
		trimData: function(val){
			return val.trim();
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
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		//for Display Icon
		setIcon : function(ClearStatus){
				debugger
			
				if(ClearStatus === "X"){
					return "sap-icon://complete";
				}
				if(ClearStatus === ""){
					return "sap-icon://pending";
				}
			
			
		},
		 
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		//for Status Icon Color
				setColor : function(ClearStatus){
					debugger
					
					if(ClearStatus === "X"){
						var color = "#008000";
						return color;
					}			
								
					if(ClearStatus === ""){
						var color = "#ff0000";
						return color; 
					}			
								
				},
				
				setBtnColor : function(ClearStatus){
					debugger
					
					if(ClearStatus === "X"){
						var color = "#008000";
						return color;
					}			
								
					if(ClearStatus === ""){
						var color = "#ff0000";
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