jQuery.sap.declare("zempdashboard.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zempdashboard.util.Formatter = {
	
		trimData:function(val){
			return val.trim();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		date1:function(oDate){
			if (oDate == undefined)	return "";
			
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
					pattern : "dd-MM-yyyy"
			});
			var sDate = new Date(oDate);
			return oDateFormat.format(sDate);
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		setIcon:function(ClearStatus){
				debugger
				if(ClearStatus == "X")	return "sap-icon://complete";
				
				if(ClearStatus == "" || ClearStatus == "0")	return "sap-icon://pending";
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		setColor:function(ClearStatus){
			debugger
			if(ClearStatus == "X"){
				var color = "#008000";
				return color;
			}

			if(ClearStatus == "" || ClearStatus == "0"){
				var color = "#ff0000";
				return color; 
			}
		},
		
		setButtonColor:function(ClearStatus){
			debugger
			if(ClearStatus == "X"){
				var color = "Accept";
				return color;
			}
			if(ClearStatus == "" || ClearStatus == "0"){
				var color = "Reject";
				return color;
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		date:function(oDate){
			debugger
			if (oDate == undefined || oDate == "") return "";

			var date  = oDate.split("-");
			date[2]   = date[2].slice(0,2);
			var final = date[2]+"-"+date[1]+"-"+date[0];
			return final;
		},
};