
jQuery.sap.declare("zRequestCart.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zRequestCart.util.Formatter = {
	
		
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
		attachmentIcon: function(file){
			if(file){
				var ext = file.split('.')[1];
				if(ext == "pdf" || ext == "PDF"){
					return "sap-icon://pdf-attachment"; 
				}else if(ext == "jpg" || ext == "jpeg" || ext == "JPG" || ext == "JPEG"){
					return "sap-icon://background";
				}
			}
		},
		onOpenLink: function(docNo){
			
				if(docNo == ""){
					return false;
				}else{
					return true;
				}
			
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
		}
		
		
			
};