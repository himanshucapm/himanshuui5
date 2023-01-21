
jQuery.sap.declare("zstatnryrequest.utils.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zstatnryrequest.utils.Formatter = {
	
		trimData: function(val){
			return val.trim(); 
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
		setIcon : function(Status){
				debugger
			
				if(Status === "01"){
					return "sap-icon://validate";
				}
				if(Status === "02"){
					return "sap-icon://pending";
				}
				if(Status === "03"){
					return "sap-icon://decline";
				}
				if(Status === "04"){
					return "sap-icon://accept";
				}
			
			
		},
		 
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		//for Status Icon Color
				setColor : function(Status){
					debugger
					if(Status === "01"){
						var color = "#e78c07";
						return color;
					}			
					if(Status === "02"){
						var color = "#2b7d2b";
						return color; 
					}			
					if(Status === "03"){
						var color = "#bb0000";
						return color; 
					}	
					if(Status === "04"){
						var color = "#FF0000";
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