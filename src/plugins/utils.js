import configData from '../config/data.js'

String.prototype.replaceAll = function (destinateStr, sourceStr) { 
  var reg = new RegExp(destinateStr, "g"),
    result = this.replace(reg, sourceStr); 
  return result; 
}
String.prototype.remove = function (removeStr, removeAll) { 
  var result;
  if (removeAll) {
    result = this.replaceAll(removeStr, "");
  } else {
    result = this.replace(removeStr, ""); 
  }
  return result; 
}
const dateUtil = {
  timeToDate: function(time) {
    if (!time) {
      console.log('incorrect input params! ex: timeToDate(1400112321)');
      return -1;
    } else {
      var date = new Date();
      date.setTime(time);
      return date;
    }
  },

  dayToDate: function(year, day) {
    if (year.toString().length != 4 && !day) {
      console.log('incorrect input params! ex: dayToDate("2016","100")');
      return -1;
    } else {
      var _start = new Date(year.toString() + '-01-01');
      var _end = new Date();
      _end.setTime(_start.getTime() + (parseInt(day) - 1) * 24 * 3600 * 1000);
      return _end;
    }
  },

  periodToDate: function(period) {
    if (!period) {
      console.log('incorrect input params! ex: periodToDate("201613")');
      return -1;
    }
    var date;
    period = period.toString();
    
    var year = period.substr(0, 4);
    var period = period.substr(4);
    var month = parseInt(period / 3);
    var day = this.periodToDay(period % 3);
    if ((period % 3 - 1) >= 0) {
      month += 1;
    }
    month -= 1;
    date = new Date(year, month , day)
    return date;
  },

  periodToDay: function(period) {
    period = parseInt(period);
    if (period > 3) {
      period = period % 3
    }
    var day = 0;
    if (period == 2) {
      day = '11';
    }
    else if (period == 3 || period == -1 || period == 0) {
      day = '21';
    }
    else {
      day = '01';
    }
    return day;
  },

  periodToMonth: function(period) {
    period = parseInt(period);
    
    var month = 0;
    if (period > 33) {
      month = 12
    } else if (period < 3) {
      month = 1
    } else if (period % 3 === 0){
      month = period / 3
    } else if (period / 3 > 1) {
      month = Math.floor(period / 3) + 1
    }
    if (month < 10) {
      month = '0' + month
    }
    return month;
  },

  dateToDay: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var firstDay = new Date(date.getFullYear()+'-01-01');
    var days = date - firstDay;
    return Math.ceil(days / (24 * 3600 * 1000));
  },

  dayToPeriod: function(day) {
    if (!day) {
      console.log('incorrect input params! ex: periodToDate(10)');
      return -1;
    }

    day = parseInt(day);
    if (day > 31 || day < 0) {
      console.log('incorrect input, correct format is day in a month between 1 and 31 .');
      return -1;
    }
    var period = 0;
    if ( day <= 10) {
      period = 1;
    }
    else if (day <= 20) {
      period = 2;
    }
    else {
      period = 3;
    }
    return period;
  },

  dateToPeriod: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }

    var period = 0;
    var month = date.getMonth();
    var period = this.dayToPeriod(date.getDate());
    period = month * 3 + period;
    if (period < 10) 
      period = '0' + period;
    return period;
  },

  formatDateToSecond: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + "-"
      + month + "-"
      + day + ' '
      + date.getHours() + ':'
      + date.getMinutes() + ':'
      + date.getSeconds();
  },
  formatDateToMonthZH: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    return date.getFullYear() + "年" + month + "月";
  },
  formatDateZH: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + "年" + month + "月" + day + "日" ;
  },
  formatDateNoZero: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + "/" + month + "/" + day;
  },
  formatDate: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
  },
  perviousYear: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    return new Date((date.getFullYear() - 1), date.getMonth(), date.getDate());
  },

  daysPerMonth: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var year = date.getFullYear();
    var month = date.getMonth();
    return (32 - new Date(year, month, 32).getDate());
  },
  
  preTwoMonth: function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    date = new Date(formatDate(date));
    var month = date.getMonth();
    if (month >1) {
      date.setMonth(month-2);
    } else if (month == 1) {
      date.setMonth(11)
      date.setFullYear(date.getFullYear() - 1);
    } else if (month == 0) {
      date.setMonth(10)
      date.setFullYear(date.getFullYear() - 1);
    }
    return date;
  } 
}
const cookieUtil = {
  // s20 = 20 seconds
  // h12 = 12 hours
  // d30 = 30 days(defualt)
  setCookie: function(name, value, time) {
    if (!time) {
      time = "30d"
    }
    var strsec = this.getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  },
  getCookie: function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

      return (arr[2]);
    else
      return null;
  },

  delCookie: function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },
  getsec: function(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
      return str1 * 1000;
    } else if (str2 == "h") {
      return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  }
}
const formatData = {
  // translate api data into echart data format, used in weather( and monitor)
  apiDataToDay: function(options) {
    var _this = this;
    var _data = {},
        _startYear = parseInt(options.startDate.getFullYear()),
        _endYear = parseInt(options.endDate.getFullYear()),
        _startDay = parseInt(dateUtil.dateToDay(options.startDate)),
        _endDay = parseInt(dateUtil.dateToDay(options.endDate));

    _data.Y = [];
    _data.X = [];

    // set xaxis data form selected date
    var setDayxAxis = function(year, day) {
      var date = dateUtil.dayToDate(year, day);
      return dateUtil.formatDateNoZero(date)
    } 

    var isEnd = function() {
      if (_startYear > _endYear ) 
        return false;
      if (_startYear == _endYear && _startDay == _endDay) 
        return false;
      var days = (_startYear % 4 == 0 && _startYear % 100 !=0) ||
                (_startYear % 100 == 0 && _startYear % 400 == 0) ? 366 : 365;
      if( (_startDay + 1) > days ) {
        _startYear += 1;
        _startDay = 0;
      } else {
        _startDay += 1;
      }
      return true;
    }

    while(isEnd()) {
      var keyOfDay;
      if(_startDay < 10) {
        keyOfDay = "00" + _startDay;
      } else if (_startDay < 100) {
        keyOfDay = "0" + _startDay;
      } else 
        keyOfDay = _startDay
      
      if (options.data[_startYear] && options.data[_startYear][keyOfDay]) {
        _data.Y.push(options.data[_startYear][keyOfDay]);
      } else if (options.data[_startYear] && options.data[_startYear][keyOfDay] == "0.0") {
        _data.Y.push(0);
      } else
        _data.Y.push(null);
      _data.X.push(setDayxAxis(_startYear, keyOfDay));
    }

    return _data;
  },

  // translate api data into echart data format, used in weather( and monitor)
  apiDataToPeriod: function(options) {
    var _this = this;
    var _data = {},
        _startYear = parseInt(options.startDate.getFullYear()),
        _endYear = parseInt(options.endDate.getFullYear()),
        _startPeriod = parseInt(dateUtil.dateToPeriod(options.startDate)) - 1,
        _endPeriod = parseInt(dateUtil.dateToPeriod(options.endDate));

    _data.Y = [];
    _data.X = [];

    // set xaxis data form selected date
    var setPeriodxAxis = function(year, period) {
      var periodContent, dateStr;
      if ( parseInt(period) < 10 ) {
        if (options.CN) {
          periodContent = configData.dateItem.period[(parseInt(period) - 1)];
          periodContent = periodContent['0' + parseInt(period)];
          dateStr = year + '年' + periodContent;
        } else if(options.ENCN) {
          periodContent = configData.dateItem.periodENCN[(parseInt(period) - 1)];
          periodContent = periodContent['0' + parseInt(period)];
          dateStr = year + '/' + periodContent;
        } else {
          periodContent = configData.dateItem.periodEN[(parseInt(period) - 1)];
          periodContent = periodContent['0' + parseInt(period)];
          dateStr = year + '-' + periodContent;
        }
      } else {
        if (options.CN) {
          periodContent = configData.dateItem.period[(parseInt(period) - 1)];
          periodContent = periodContent[parseInt(period)];
          dateStr = year + '年' + periodContent;
        } else if(options.ENCN) {
          periodContent = configData.dateItem.periodENCN[(parseInt(period) - 1)];
          periodContent = periodContent[parseInt(period)];
          dateStr = year + '/' + periodContent;
        } else {
          periodContent = configData.dateItem.periodEN[(parseInt(period) - 1)];
          periodContent = periodContent[parseInt(period)];
          dateStr = year + '-' + periodContent;
        }
      }

      return dateStr;
    }

    var isEnd = function() {
      if (_startYear > _endYear ) 
        return false;
      if (_startYear == _endYear && _startPeriod == _endPeriod) 
        return false;

      if( (_startPeriod + 1) > 36 ) {
        _startYear += 1;
        _startPeriod = 1;
      } else {
        _startPeriod += 1;
      }
      return true;
    }

    while(isEnd()) {
      var keyOfPeriod = (_startPeriod < 10) ? "0" + _startPeriod : _startPeriod;
      if (options.data[_startYear] && options.data[_startYear][keyOfPeriod]) {
        _data.Y.push(options.data[_startYear][keyOfPeriod]);
      } else 
        _data.Y.push(null);
      _data.X.push(setPeriodxAxis(_startYear, keyOfPeriod));
    }

    return _data;
  }, 

  // because the chart date title is to long, cut it
  // dateArr ＝ ["2016年01上旬","2016年02上旬","2017年04上旬","2017年04上旬"];
  cutDateFootnote: function(dateArr) {
    var year = dateArr[0].substr(0,4);
    for (var i = 0; i < dateArr.length; i++) {
      if(i>0 && year==dateArr[i].substr(0,4))
        dateArr[i] = dateArr[i].substr(5);
      else
        year = dateArr[i].substr(0,4)
    }
    return dateArr;
  },
  // using object property to replace "{{variable}}" string in html
  formatHtml: function(htmlTep, arrayObject) {
    var html = '', _htmlTem;
    for(var i = 0, len = arrayObject.length; i < len; i++) {
      for(var key in arrayObject[i]) {
        if (htmlTep.indexOf("{{"+key+"}}") > 0) {
          _htmlTem = arrayObject[i].htmlTempalte ? arrayObject[i].htmlTempalte : htmlTep;
          arrayObject[i].htmlTempalte = _htmlTem.replaceAll("{{"+key+"}}", arrayObject[i][key]);
        }
        else 
          continue;
      }
      html += arrayObject[i].htmlTempalte;
    }
    return html;
  }
}
const elementUtil = {
  drag: function(container, targeter, leftBoundary, rightBoundary, callback) {
    var params = {
      left: 0,
      currentX: 0,
      flag: false
    };
    // Get the element's CSS value by property name
    function getCssValue(element, propertyName) {
      return element.currentStyle ? 
             element.currentStyle[propertyName] : 
             document.defaultView.getComputedStyle(element ,false)[propertyName]; 
    };
    
    targeter.onmousedown = function(event){
      params.flag = true;
      params.currentX = event.clientX;
    };

    document.onmouseup = function(){
      params.flag = false; 
    };

    container.onmouseup = function(){
      params.flag = false; 
    };

    container.onmousemove = function(event){
      params.left = parseInt(getCssValue(targeter, "left").slice(0, -2));
      if(params.flag){
        var nowX = event.clientX;
        var disX = nowX - params.currentX;
        params.currentX = nowX
        if (typeof rightBoundary == "number" && params.left + disX >= rightBoundary) {
          targeter.style.left = rightBoundary+ "px";
        } else if(typeof leftBoundary == "number" && params.left + disX <= leftBoundary ) {
          targeter.style.left = leftBoundary + "px";
        }
        else {
          targeter.style.left = params.left + disX + "px";
        }
        if (typeof callback ==='function') {
          callback(params.left + disX)
        }
      }
    } 
  },
  downLoad: function (filePath) {
    var a = document.createElement('a');
    a.href = filePath;
    a.target = '_blank';
    a.id = 'download_file';
    document.body.appendChild(a);
    var alink = document.getElementById('download_file');
    alink.click();
    alink.parentNode.removeChild(a);
  }
}
export {
  dateUtil,
  cookieUtil,
  formatData,
  elementUtil
}