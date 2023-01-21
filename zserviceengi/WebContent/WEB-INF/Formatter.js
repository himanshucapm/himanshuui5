
jQuery.sap.declare("ztyre_discount.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
ztyre_discount.util.Formatter = {
	 
		
	/*	getTransparentLogoLink:function(sImgName){
			var sRootPath = JQuery.sap.getModulePath("ztyre_discount");
			return sRootPath + "./img/jk.png";
			},
		 */
		date1:function(oDate){
		     if (oDate == undefined)
		                     return "";
		     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
		     });
		     var sDate = new Date(oDate);
		     return oDateFormat.format(sDate);                       
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
		
		
		
		setIcon1 : function(BuyFor){
			
			if(BuyFor){
				if(BuyFor === "S"){
					return "sap-icon://account";//Self
					}	
				if(BuyFor === "O"){
					return "sap-icon://collaborate";//Others
					}					
			}
		},
		
		//for Status Icon Color
		setColor1 : function(BuyFor){
			if(BuyFor === "S"){
				var color = "#dd6512";
				return color;
				
			}
			if(BuyFor === "O"){
				var color = "#6495ed";
				return color;				
			}
		},
		
		setIcon2 : function(Status){			
			if(Status){
				if(Status === "SUBM"){
					return "sap-icon://pending";
				}
				if(Status === "APPR"){
					return "sap-icon://employee-approvals";
					}
				if(Status === "REJC"){
					return "sap-icon://employee-rejections";
				}
				if(Status === "USED"){
					return "sap-icon://accept";//Discount Coupon Used
					}	
				if(Status === "ISSU"){
					return "sap-icon://approvals";//Discount Coupon Issued				
			}
			}
		},		
//////////////////////////////////////////////////////////////////////////////////////////////////

		
		setColor2 : function(Status){
			if(Status === "APPR"){
					var color = "#31ae31";
					return color;
				}
				if(Status === "SUBM"){
					var color = "#FFD700";
					return color;
				}
				if(Status === "REJC"){
					var color = "#fa6135";
					return color;
					
				}
				if(Status === "USED"){
					var color = "green";
					return color;
					
				}
				if(Status === "ISSU"){
					var color = "green";
					return color;
					
				}
			},

};