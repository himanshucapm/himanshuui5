
jQuery.sap.declare("zstencilmaster.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zstencilmaster.util.Formatter = {
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
		
		ipcond:function(val)
		{
			debugger
			if(val =="H")
				return "Hot";
			if(val=="C")
				return "Cold";
		},
		
		onOwner:function(owner)
		{
			debugger
			if(owner =="01" || owner == 01 || owner == "1" || owner == 1)
				return "01";
			if(owner =="02" || owner == 02 || owner == "2" || owner == 2)
				return "02";
			if(owner =="03" || owner == 03 || owner == "3" || owner == 3)
				return "03";
		},
		
		
		Time: function(val) {
			  if (val) {
			    val = val.replace(/^PT/, '').replace(/S$/, '');
			    val = val.replace('H', ':').replace('M', ':');
 
			    var multipler = 60 * 60;
			    var result = 0;
			    val.split(':').forEach(function(token) {
			      result += token * multipler;
			      multipler = multipler/ 60;
			    });
			    var timeinmiliseconds = result * 1000;

			    var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
			      pattern: "HH:mm:ss a"
			    });
			    var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			    return timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
			  }
			  return null;  
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