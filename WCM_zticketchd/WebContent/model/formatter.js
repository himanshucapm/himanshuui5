sap.ui.define([
  ], function () {
    "use strict";

    return {
      /**
       * Rounds the currency value to 2 digits
       *
       * @public
       * @param {string} sValue value to be formatted
       * @returns {string} formatted currency value with 2 digits
       */
      currencyValue : function (sValue) {
        if (!sValue) {
          return "";
        }

        return parseFloat(sValue).toFixed(2);
      }, //end of currencyValue Method
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


date1:function(oDate){
    if (oDate == undefined)
                    return "";
    var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
                    pattern : "dd-MM-YYYY"
    });
    var sDate = new Date(oDate);
    return oDateFormat.format(sDate);                       
},

Warennt:function(value){
	if(value=="true"){
		return true
	}else if(value=="false"){
		return false
	}
},


      date: function(oDate){
    	  if(oDate!=null && oDate!=""){
//        var sFinalDate = oDate;
//        var sFinalNumber = sFinalDate.replace(/[^0-9]+/g,'' );
//        var iFinalNumber = sFinalNumber * 1; //trick seventeen
//        sFinalDate = new Date(iFinalNumber);
//        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
//        pattern: "yyyy-MM-dd'T'HH:mm:ss"
//      });
      var sDate = new Date(oDate);
      return sDate;
    	  }else{
    		  return null;
    	  }

      }
    };
    });