jQuery.sap.declare("ztrkwhlreport.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
ztrkwhlreport.util.Formatter = {
			
	date1 : function(oDate){
			
			if (oDate == undefined || oDate == "")
				return "";
			
			var date  = oDate.split("-");
			date[2]   = date[2].slice(0,2);
			var final = date[2]+"-"+date[1]+"-"+date[0];
			return final;
		     
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
			debugger
			if(value=="X"){
				return true;
			}else{
				return false;
			}
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
//for Display Icon
		setIcon : function(status){
				debugger
			if(status){
				if(status === "P"){
					return "sap-icon://account";
				}
				if(status === "A"){
					return "sap-icon://employee-approvals";
				}
				if(status === "C"){
					return "sap-icon://accept";
				}
				if(status === "R"){
					return "sap-icon://decline";
				}
				if(status === "E"){
					return "sap-icon://synchronize";
				}
				if(status === "X"){
					return "sap-icon://cancel";
				}
			}
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
//for Status Icon Color
		setColor : function(status){
			debugger
			if(status === "P"){
				var color = "#000000";
				return color;
			}
			if(status === "A"){
				var color = "#2b7d2b";
				return color;
			}			
			if(status === "C"){
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
			if(status === "X"){
				var color = "#ff0000";
				return color;
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