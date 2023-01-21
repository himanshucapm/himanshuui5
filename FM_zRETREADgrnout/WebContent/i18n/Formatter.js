jQuery.sap.declare("zretreadjobcard.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

zretreadjobcard.util.Formatter = {
	
		
		date1:function(oDate){
			
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);                       
		},
		
		      date: function(oDate){
		    	  if(oDate!=null && oDate!=""){

		      var sDate = new Date(oDate);
		      return sDate;
		    	  }else{
		    		  return null;
		    	  }

		      },
		      
		      repairIcon : function(Type){
					if(Type){
						if(Type === "R"){
							return "sap-icon://complete";
							}	
						if(Type === "N"){
							return "sap-icon://decline";
							}	
						}
					},
					
					repairColor : function(Color){
						if(Color){
							if(Color === "R"){
								return "#33cc33";
								}	
							if(Color === "N"){
								return "#ff0000";
								}	
							}
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
					
						StpEnable:function(value){
							if(value=="STP"){
								this.setSelectedKey("02");
								return false;
							}else{
								return true;
							}
						},
						StpEnable1:function(value){
							if(value=="STP"){
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
						
				//////////////////////////////////////////////////////////////////////////////////////////////////
				//for Display Icon
						setIcon : function(Status){
							debugger
							
							if(Status === "C"){
							return "sap-icon://vehicle-repair";
							}
							if(Status === "E"){
								return "sap-icon://complete";
								}
							if(Status === "F"){
								return "sap-icon://technical-object";
								}
							if(Status === "G"){
							return "sap-icon://inventory";
							}
						},


				//////////////////////////////////////////////////////////////////////////////////////////////////
				//for Status Icon Color
						setColor : function(Status){
							debugger
							
							if(Status === "C")
								return "#9c062c";
							
							if(Status === "E")
								return "#008000";
							
							if(Status === "F")
								return "#06979c";
							
							if(Status === "G")
								return"green";
							
						},

						statusText : function(Status){
							debugger
							
							if(Status == "C")
								return "Under-Repair";
							
							if(Status == "E")
								return "Repaired";
							
							if(Status == "F")
								return "Not-Repaired";
							
							if(Status == "G")
								return "Dispatch";
							
						},
				//////////////////////////////////////////////////////////////////////////////////////////////////
						//for Display Icon
							setIcon1 : function(CType){
								debugger
								
								if(CType === "F"){
									return "sap-icon://customer-and-supplier";
								}
								if(CType === "W"){
									return "sap-icon://customer";
									}
							},

				//////////////////////////////////////////////////////////////////////////////////////////////////
						//for Status Icon Color
							setColor1 : function(Status){
								debugger
								
								if(Status === "F")
								return "#6600cc";
								
								if(Status === "W")
								return "#33cc33";
								
							},

							customerType : function(CType){
								debugger
								
								if(CType === "F")
									return "Fleet";
								
								if(CType === "W")
									return "Walk-In";
							
							},
							
							repairStatusText : function(JobStatus){
								debugger
								
								if(JobStatus === "R")
									return "Required";
								
								if(JobStatus === "N")
									return "Not-Required";
							
							},
};