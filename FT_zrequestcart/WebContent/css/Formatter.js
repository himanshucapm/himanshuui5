jQuery.sap.declare("com.musashi.scan.model.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
var DateFormat = sap.ui.core.format.DateFormat;
com.musashi.scan.model.Formatter = {
		currencyValue : function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		// date format to dd-MM-yyyy
		dateFormat_dd_MM_yyyy : function(oDate) {
			if (oDate == null || oDate == "") {
				return "";
			}
			if (typeof oDate == 'string') {
				return oDate;
			}
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern : "dd-MM-yyyy"
			});
			return oDateFormat.format(oDate);
		},


		descCodeFormatter:function(code,desc1){
			if (code !== null && code !== "") {
				if (desc1 !== undefined && desc1 !== null && desc1 !== "") {
					var desc = desc1;
					return desc + " (" + code + ")";
				}  else {
					return code;
				}
			}else{
				return desc1;
			}
			return "";
		},


		pageTitleFormatter:function(prTitle,poTitle,userMode,moduleType){
			var title="";
			if(moduleType){
				if(moduleType==="PO"){
					var title=poTitle;
				}else{
					var title=prTitle;
				}
			}else{
				var title=prTitle;
			}
			
			if(userMode){
				if(userMode==="R"){
					title=title+" Requestor"
				}
				if(userMode==="V1"){
					title=title+" Verifier"
				}
				if(userMode==="S"){
					title=title+" SSC"
				}
			}
			return title;
		},

		// Time HH/MM format
		TIME_hhmma : function(oValue) {
			if (oValue == undefined) {
				return "";
			}

			if (!(oValue instanceof Date)) {
				var oValuelen = oValue.toString().length;
				if (oValuelen <= 5)
					return oValue;
			}
			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else if (oValue.ms || oValue.ms == 0) {
				var hours = (oValue.ms / (3600 * 1000)) | 0;
				var minutes = ((oValue.ms - (hours * 3600 * 1000)) / (60 * 1000)) | 0;
				var seconds = ((oValue.ms - (hours * 3600 * 1000) - (minutes * 60 * 1000)) / 1000) | 0;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			} else {
				if (typeof oValue != 'string' && !(oValue instanceof String))
					return "";
				if (oValue.length != 11)
					return "";
				if (oValue.slice(0, 2) != "PT" || oValue.slice(4, 5) != "H" || oValue.slice(7, 8) != "M" || oValue.slice(10, 11) != "S") {
					return "";
				}
				var hours = oValue.slice(2, 4) * 1;
				var minutes = oValue.slice(5, 7) * 1;
				var seconds = oValue.slice(8, 10) * 1;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			}

			var oDateFormat = sap.ca.ui.model.format.DateFormat.getTimeInstance({
				style : "short",
				pattern : "HH:mm:ss"
			});
			var sTime = oDateFormat.format(oDate);
			var aTimeSegments = sTime.split(":");
			var sAmPm = "";
			var lastSeg = aTimeSegments[aTimeSegments.length - 1];

			// chop off seconds
			// check for am/pm at the end
			if (isNaN(lastSeg)) {
				var aAmPm = lastSeg.split(" ");
				// result array can only have 2 entries
				aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
				sAmPm = " " + aAmPm[1];
			}
			return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);
		},

		// set Travel Table Date and Time
		formatTravelDateTime : function(oDate, oTime) {
			var date = "";
			var time = "00:00";
			var oSrc = this;
			var index = oSrc.getId().split("-").pop();
			var model = oSrc.getModel("travelDetailsModel");
			if (typeof oDate == 'string') {
				return oDate + " " + oTime;
			}
			if (oDate != "" || oDate != null) {
				date = com.musashi.scan.model.Formatter.dateFormat_dd_MM_yyyy(oDate);
				if (oTime != "" || oTime != null) {
					time = com.musashi.scan.model.Formatter.TIME_hhmma(oTime);
				}
				model.setProperty("/oItems/" + index + "/DepartureDate", date + " " + time);
				return date + " " + time;
			}
			model.setProperty("/oItems/" + index + "/DepartureDate", date + " " + time);
			return "";
		},

		// **********************
		// date format to yyyy-mm-ddT00:00:00
		dateFormat_yyyy_mm_ddT : function(oDate) {
			if (oDate == null || oDate == "") {
				return "";
			}
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern : "yyyy-MM-ddT05:30:00"
			});
			return oDateFormat.format(oDate);
		},

		// date format to IST full date
		dateFormatParse : function(oDate) {
			if (oDate == null || oDate == "") {
				return "";
			}
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern : "dd-MM-yyyy"
			});
			return oDateFormat.parse(oDate);
		},

		// date format to IST full date
		timeFormatParse : function(oTime) {
			if (oTime == null || oTime == "" || oTime.ms == 0) {
				return "PT00H00M00S";
			}

			var time = "";
			if (oTime.ms) {
				time = com.musashi.scan.model.Formatter.TIME_hhmma(oTime).split(":");
			} else {
				time = oTime.split(":");
			}

			return "PT" + time[0] + "H" + time[1] + "M" + "00S";
		},
		dateFormatter: function(date) {
			if (date !== undefined && date !== null && date !== "") {
				var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
				var oDateFormat = DateFormat.getInstance({pattern:"dd/MM/yyyy"}, oLocale);
				var formattedDate = oDateFormat.format(new Date(date));
				return formattedDate;
			} else {
				return date;
			}
		},
		
		getCurrentFiscalYear:function(date){
			//get current date
			var today = new Date();

			//get current month
			var curMonth = today.getMonth();

			var fiscalYr = "";
			if (curMonth > 3) { //
				var nextYr1 = (today.getFullYear() + 1).toString();
				fiscalYr = today.getFullYear().toString() + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
			} else {
				var nextYr2 = today.getFullYear().toString();
				fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
			}

			//return fiscalYr;
			return fiscalYr.split("-")[0];
		},

		// date format to yyyy-mm-ddT00:00:00
		timeFormat_PT_hh_mm : function(oTime) {
			if (oTime == null || oTime == "") {
				return "";
			}
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern : "Thh:mm:ss"
			});
			return oDateFormat.format(oTime);
		}
};