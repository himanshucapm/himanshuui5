
jQuery.sap.declare("zInitiESeparat.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zInitiESeparat.util.Formatter = {
	
		trimData: function(val){
			return val.trim();
		},
	
	//	pattern : "MM.dd.yyyy"
		date2:function(oDate){
			
			     if (oDate == undefined)
			                     return "";
			     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
			                     pattern : "dd-MM-yyyy"
			     });
			     var sDate = new Date(oDate);
			     return oDateFormat.format(sDate);                       
			},
		
			date3:function(oDate){
			
				     if (oDate == undefined)
				                     return "";
				     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				                     pattern : "dd.MM.yyyy"
				     });
				     var sDate = new Date(oDate);
				     return oDateFormat.format(sDate);                       
				},
			
			setColor : function(ResStatusText){
				
				if(ResStatusText === "Accepted at L2"){
					var color = "#2b7d2b";
					return ;
				}			
			},
			
			
		setBaseDate: function(val){
	
			   try{
			    if(val=="00000000"){
			                    return "";
			                }else{
			                    return val;
			                }
			            }catch(e){
			                return "";
			            }
			        },
		 	
};