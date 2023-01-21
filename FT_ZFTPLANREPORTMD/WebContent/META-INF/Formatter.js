
jQuery.sap.declare("zinspection.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
zinspection.util.Formatter = {
	
		
		date1:function(oDate){
			debugger
		     if (oDate == undefined)
		         return "";
		     
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     	pattern : "dd-MM-yyyy"
		     					});
		     return oDateFormat.format(oDate);
		},
		
		yesNo:function(val){
			if(val == "Y"){
				return "Yes";
			}
			if(val == "N"){
				return "No";
			}
		},
		
		cart:function(val){
			debugger
			if(val == "X"){
				return "sap-icon://cart";
			}
			
			if(val == "" || val == undefined){
				return "";
			}
		},
		
		/*setColor : function(val){
			
			if(val === "X"){
				var color = "#e78c07";
				return color;
			}
			
			if(val == "" || val == undefined){
				return "";
			}
		},
		*/
		
		StpEnable:function(value){
			if(value=="STP"){
				this.setSelectedKey("02");
				this.getParent().getItems()[1].setVisible(true);
				return false;
			}else{
				return true;
			}
		},
		
		Mobile:function(value){
			if(value!=""){
				var no=value.replace("+91","");
				return no;
				
			}else{
				return value;
			}	
				
		},
		
		SelecFlg:function(value){
			if(value=="X"){
				return true;
			}else{
				return false;
			}
		},
		
		date: function(oDate){
			if(oDate!=null && oDate!=""){
//		        var sFinalDate = oDate;
//		        var sFinalNumber = sFinalDate.replace(/[^0-9]+/g,'' );
//		        var iFinalNumber = sFinalNumber * 1; //trick seventeen
//		        sFinalDate = new Date(iFinalNumber);
//		        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
//		        pattern: "yyyy-MM-dd'T'HH:mm:ss"
//		      });
		      var sDate = new Date(oDate);
		      return sDate;
		    	  }else{
		    		  return null;
		    	  }
		      }	 	
};