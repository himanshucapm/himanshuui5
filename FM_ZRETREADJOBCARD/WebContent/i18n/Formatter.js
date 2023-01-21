jQuery.sap.declare("zretreadrepair.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zretreadrepair.util.Formatter = {
		date1:function(oDate){
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);                       
		},
		
		date2:function(oDate){
			debugger
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);
		},
		
		CustType : function(Type){
			if(Type){
				if(Type === "F"){
					return "sap-icon://customer-and-supplier";
					}	
				if(Type === "W"){
					return "sap-icon://customer";
					}	
				}
			},
			
			CustColor : function(Color){
				if(Color){
					if(Color === "F"){
						return "#6600cc";
						}	
					if(Color === "W"){
						return "#33cc33";
						}	
					}
				},
			
		setIcon1 : function(Status){
			if(Status){
				if(Status === "E"){
					return "sap-icon://process";//Processed 
					}	
				if(Status === "F"){
					return "sap-icon://shipping-status";//dispatched
					}	
				if(Status === "C"){
					return "sap-icon://sys-cancel";//not Processed
					}					
				}
			},
		//for Status Icon Color
		setColor1 : function(Status){
			if(Status === "E"){
				var color = "#00ff00";//Processed
				return color;
				}
			if(Status === "F"){
				var color = "#ff8533";//dispatched
				return color;				
				}
			if(Status === "C"){
				var color = "#ff0000";//not Processed
				return color;				
				}
			},
		};