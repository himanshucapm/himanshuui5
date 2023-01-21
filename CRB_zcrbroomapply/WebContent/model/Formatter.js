
jQuery.sap.declare("ZRACEMGMT.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
ZRACEMGMT.util.Formatter = {
	
		
		date1:function(oDate){
		     if (oDate == undefined || oDate == "")
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var v = oDate.split("(")[1].split(")")[0];
		    	 v = parseInt(v);
		     var sDate = new Date(v);
		     return oDateFormat.format(sDate);
		},
		
		total: function(a,b,c,d,e){
			
			var total= parseFloat(a) + parseFloat(b) + parseFloat(c) + parseFloat(d) + parseFloat(e);
			var t =  total.toFixed(2);
			return t;
			
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
		
		
		status: function(v){
			var text = "";
			
			switch(v) {
			
		    case "APRD":
		        text = "Approved";
		        break;
		    case "INPR":
		        text = "Under Approval";
		        break;
		    case "REJT":
		        text = "Rejected";
		        break;
		    default:
		        text = "";
		}
			
			return text;
			
		},
		
		statusColor: function(v){
			
			var text = "";
			
			switch(v) {
			
		    case "APRD":
		        text = "Success";
		        break;
		    case "INPR":
		        text = "Warning";
		        break;
		    case "REJT":
		        text = "Error";
		        break;
		    default:
		        text = "None";
		}
			
			return text;
		},
		
		editBtn : function(v){
			
			if(v === "X"){
				return true;
			}else{
				return false;
			}
		},
		
	//for Display Icon
		setIcon : function(status){
			debugger
			
				if(status == "I"){
					return "sap-icon://begin";
				}
				
				if(status == "P"){
					return "sap-icon://account";
				}
				if(status == "A"){
					return "sap-icon://employee-approvals";
				}
				if(status == "R"){
					return "sap-icon://decline";
				}
				
				if(status == "M"){
					return "sap-icon://pending";
				}
				
				/*if(status == ""){
					return "sap-icon://begin";
				}*/
		
			
		},
		
		//for Status Icon Color
		setColor : function(status){
			/*if(status == "I"){
				var color = "#0973f7";
				return color;
			}*/
			if(status == "P"){
				var color = "#eb8b46";
				return color;
			}
			if(status == "A"){
				var color = "#13c213";
				return color;
			}			
						
			if(status == "R"){
				var color = "#ff0000";
				return color;
			}
			
			if(status == "M"){
				var color = "#f3cf1c";
				return color;
			}
			
			/*if(status == ""){
				var color = "#0973f7";
				return color;
			}*/
				
		}
		
		
		
			
};