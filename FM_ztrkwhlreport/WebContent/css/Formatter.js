
jQuery.sap.declare("ztwcjobcreate.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
ztwcjobcreate.util.Formatter = {
	
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
		Code:function(val1,val2){
			if(val1==""&&val2==""){
				return "";
			}else{
			return val1+" ("+val2+")"
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
		StpEnable:function(value){
			if(value=="STP"){
				this.setSelectedKey("02");
				//this.getParent().getItems()[1].setVisible(true);
				return false;
			}else{
				return true;
			}
		},
		StpEnable1:function(value){
			if(value=="STP"){
				//this.setSelectedKey("02");
				//this.getParent().getItems()[1].setVisible(true);
				return false;
			}else{
				return true;
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

		      },
		      INRValue: function(val){
		    	  if(val == null || val == ""){
		    		  return "false";
		    	  }else{
		    		  return "true";
		    	  }
		      },
		      costFormat:function(cost){
		    	  if(cost){
		    		  cost = parseFloat(cost).toFixed(2);
		    		  return cost +" INR";
		    	  }else{
		    		  return cost;
		    	  }
		      }
};