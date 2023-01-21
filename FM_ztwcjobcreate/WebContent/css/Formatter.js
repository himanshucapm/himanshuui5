
jQuery.sap.declare("zappeovalreq.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zappeovalreq.util.Formatter = {
	
		
		date1:function(oDate){
			debugger
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
		
		status: function(v){
			debugger
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

		//for Display Icon
		setIcon: function(status){
			debugger
			if(status){
				if(status === "PAPR"){
					return "sap-icon://employee-approvals";
				}
				if(status === "PACT"){
					return "sap-icon://employee-approvals";
				}
				if(status === "APPR"){
					return "sap-icon://complete";
				}
				if(status === "CLSD" || status === "SHCL"){
					return "sap-icon://decline";
				}
				if(status === "HOLD"){
					return "sap-icon://documents";
				}
				if(status === "EDIT"){
					return "sap-icon://synchronize";
				}
			}
			
		},
		 
		//for Status Icon Color
		setColor: function(status){
			if(status === "PAPR"){
				var color = "#617d96";
				return color; 
			}
			
			if(status === "PACT"){
				var color = "#e78c07";
				return color;
			}
			
			if(status === "APPR"){
				var color = "#2b7d2b";
				return color;
			}
			
			if(status === "CLSD" || status === "SHCL"){
				var color = "#e78c07";
				return color;
			}
			if(status === "HOLD"){
				var color = "#e78c07";
				return color;
			}
			if(status === "EDIT"){
				var color = "#e78c07";
				return color;
			}
			
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
		}		
			
};