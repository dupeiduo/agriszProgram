import {formatData} from 'plugins/utils.js'
import {dateUtil} from 'plugins/utils.js'
import configData from '../config/data.js'

export default {
  formatHomeData: function (carouselData, reportData) {
    var carousel = {},
      text;
    if (carouselData.length > 0) {
      text = carouselData[0].text;
      carousel.carousel_img = carouselData[0].carousel_img;
    } else {
      text = '{"1": {"title": "全天候数据在线更新","content":"系统已实现遥感数据、气象数据的自动在线更新。保证分析数据及时更新，满足用户对指导农业生产时效性的需求。"},"2": {"title": "全自动化的处理模式","content":"系统从数据的获取，处理和信息提取，到专题产品的展现实现全自动化，在正常情况下不需要进行人工干预，保证的分析结果的快速客观。"},"3": {"title": "全部计算模型的高精度","content":"系统所采用的农作物分布模型、农作物旱情模型、农作物长势模型、单产模型等均为经过实践检验的成熟计算模型，保证计算分析结果符合实际使用精度要求。"}}';
      carousel.carousel_img = "http://dev-temp.oss-cn-beijing.aliyuncs.com/test/rscloud-offline/user-content/images/banner/banner/Topbanner.jpg";
    }
    text = JSON.parse(text);
    carousel.BannerTitle = []
    for(var key in text) {
      carousel.BannerTitle.push(text[key])
    }

    var report = [],
      reportTitle = [];
    if (reportData && reportData.data && reportData.data.length > 0) {
      report = reportData.data;
      for (var i = 0; i < report.length; i++) {
        reportTitle.push(report[i].title);
      }
    }
    return { carousel:carousel, report:report, reportTitle:reportTitle };
  },
  formatMonitorList: function (data) {
    for (var i = 0; i < data.length; i++) {
      data[i].i = i + 1;
    }
    
    return data;
  },
  formatReports: function (data) {
    for(var  i = 0;i < data.data.length; i++){
      data.data[i].time = data.data[i].content_time.split(' ')[0];
      data.data[i].report_class = '';
      data.data[i].report_label = '';
      if(data.data[i].is_new){
        data.data[i].report_class = "re-orange";
        data.data[i].report_label = "新";
      }else if(data.data[i].is_hot){
        data.data[i].report_class = "re-red";
        data.data[i].report_label = "热";
      }
    }

    return data.data;
  },
  formatDLData: function (data, start, end) {
    var result = new Object(),
      years = end - start,
      monthsZH = ["一月", "二月", "三月", "四月", "五月", "六月" ,"七月", "八月", "九月", "十月", "十一月", "十二月"],
      periodZH = ["上旬", "中旬", "下旬"];
    
    result.index = 0
    result.data = []
    for (let y = 0; y <= years; y++) {
      for(let p = 1; p <= 36; p++) {
        let periodData = {};
        if (!data[start + y]) {
          periodData.hasData = false
        } else {
          if (p < 10) {
            periodData.hasData = (data[start + y][`0${p}`] === 1)
          } else {
            periodData.hasData = (data[start + y][p] === 1)
          }
        }
        if (periodData.hasData) {
          result.index = result.data.length
        }
        let month = dateUtil.periodToMonth(p)
        let day = dateUtil.periodToDay(p)
        let period = (p > 3) ? (p - (month - 1) * 3) : p
        periodData.date = `${start + y}-${month}-${day}`
        periodData.period = monthsZH[month - 1] + periodZH[period - 1]
        result.data.push(periodData)
      }
    }
    return result
  },
  formatMonitorBar: function (data, options) {
    var bar = {};
    bar.data1 = [];
    bar.data2 = [];
    bar.data3 = [];
    bar.data4 = [];
    bar.data5 = [];
    bar.data6 = [];
    bar.parxAxis = [];
    bar.parStart = 0;
    bar.legend = options.legend;
      
    var option = {
      startDate: options.startDate,
      endDate: options.endDate,
      data: data.data,
      ENCN: true
    };
    var _data = formatData.apiDataToPeriod(option);

    bar.parxAxis = _data.X;

    var _width = 900;
    var _index = _width / 60;
    bar.parStart = (1 - (_index / _data.X.length).toFixed(2)) * 100;

    for (var i = 0; i < _data.Y.length; i++) {
      if (_data.Y[i]) {
        bar.data1.push(_data.Y[i]['1'].p);
        bar.data2.push(_data.Y[i]['2'].p);
        bar.data3.push(_data.Y[i]['3'].p);
        bar.data4.push(_data.Y[i]['4'].p);
        bar.data5.push(_data.Y[i]['5'].p);
        bar.data6.push(_data.Y[i]['6'].p);
      }
      else {
        bar.data1.push('');
        bar.data2.push('');
        bar.data3.push('');
        bar.data4.push('');
        bar.data5.push('');
        bar.data6.push('');
      } 
    }

    return bar;
  },
  formatMonitorLine: function (data, options) {
    var line = {};
    line.years = [], line.current = [], line.previous = [], line.max = [], 
    line.min = [], line.average = [], line.lineColor = line.lineColor ? line.lineColor : [];

    data = data.data;
    for(var key in data) {
      line.years.push(key);
    }
    line.years.sort(function() {return -1});

    var params = {
      startDate: new Date( options.startDate.getFullYear() + '-01-01'),
      endDate: new Date(options.endDate.getFullYear() + '-12-31'),
      ENCN: true,
      data: data
    };
    var datas = formatData.apiDataToPeriod(params);
    getAllPeriod();
    line.lineStart = (1 - 1 / 5).toFixed(2) * 100 + 0.5;

    for (var i = 0; i < 5; i++) {
      var _data = datas.Y.slice(36 * i, (36 * 6) * (i + 1));
      var eachFiveYears = getFiveYears(_data);
      line.current = line.current.concat(eachFiveYears.current);
      line.previous = line.previous.concat(eachFiveYears.previous);
      line.max = line.max.concat(eachFiveYears.max);
      line.min = line.min.concat(eachFiveYears.min);
      line.average = line.average.concat(eachFiveYears.average);
    }
    return line;
    
    function getAllPeriod() {
      var arrPeriod = [];
      
      for (var y = 0; y < 5; y++) {
        var _year = line.years[y + 5].toString();
        var _month;
        for (var i = 0; i < 36; i++) {
          var periodEn = configData.dateItem.periodENCN[i];
          if (i + 1 < 10) {
            arrPeriod.push(_year + '/' + periodEn['0' + (i + 1)]);
          }
          else {
            arrPeriod.push(_year + '/' + periodEn[(i + 1)]);
          }
        }
        if (!line.initalize && y % 2 != 0) {
          var _period = configData.dateItem.periodENCN[0]['01'];
          var _start = (_year - 1) + '/' + _period;
          var _end = _year + '/' + _period;
          var _arr = [{xAxis: _start}, {xAxis: _end}];
          line.lineColor.push(_arr); 
        }
      }

      line.initalize = true;
      line.linexAxis = arrPeriod;
      lineDifColor(line.years.slice(5));
    }

    function getFiveYears(_data) {
      var fiveYearsResult = {};

      fiveYearsResult.current = [], fiveYearsResult.previous = [], fiveYearsResult.max = [], fiveYearsResult.min = [], fiveYearsResult.average = [], fiveYearsResult.data = [];
      fiveYearsResult.data[0] = _data.slice(0,36);
      fiveYearsResult.data[1] = _data.slice(36,72);
      fiveYearsResult.data[2] = _data.slice(73,108);
      fiveYearsResult.data[3] = _data.slice(109,144);
      fiveYearsResult.data[4] = fiveYearsResult.previous = toFixed2(_data.slice(144,180));
      fiveYearsResult.current = toFixed2(_data.slice(180,216));

      for (var i = 0; i < 36; i++) {
        fiveYearsResult.max[i] = -Infinity;
        fiveYearsResult.min[i] = Infinity;
        fiveYearsResult.average[i] = '';
        var averageNum = 0;
        for (var y = 0; y < 5; y++) {
          var _value = parseInt(fiveYearsResult.data[y][i]);
          if (!!_value) {
            fiveYearsResult.max[i] = (_value > fiveYearsResult.max[i]) ? Number(_value).toFixed(2) : fiveYearsResult.max[i];
            fiveYearsResult.min[i] = (_value < fiveYearsResult.min[i]) ? Number(_value).toFixed(2) : fiveYearsResult.min[i];
            fiveYearsResult.average[i] = Number(fiveYearsResult.average[i]) + Number(Number(_value).toFixed(2));
            averageNum ++;
          }
        }
        fiveYearsResult.max[i] = (fiveYearsResult.max[i] == -Infinity) ? '-' : fiveYearsResult.max[i];
        fiveYearsResult.min[i] = (fiveYearsResult.min[i] == Infinity) ? '-' : fiveYearsResult.min[i];
        fiveYearsResult.average[i] = fiveYearsResult.average[i] ? Number(fiveYearsResult.average[i] / averageNum).toFixed(2) : '-';
      }
      return fiveYearsResult;
    }

    function toFixed2(array) {
      for (var i = 0; i < array.length; i++) {
        if (!array[i]) {
          array[i] = '-'
        } else {
          array[i] = Number(array[i]).toFixed(2);
        }
      }
      return array;
    }

    function lineDifColor(years) {
      if (!line.lineYearColor) {
        line.lineYearColor = [];
        for (var i = 0; i < 5; i++) {
          var cy = years[i].toString().substr(2,2);
          if (i % 2 != 0) {
            var arr = [{xAxis: cy + '-1月上旬'}, {xAxis: (parseInt(cy) + 1) + '-1月上旬'}];
            line.lineYearColor.push(arr);
          } 
        }
      }
    }

    return line;
  },
  formatCps: function (data) {
    for (var i = 0; i < data.length; i++) {
      data[i].publish_time = data[i].publish_time.split(' ')[0];
    }
    return data;
  },
  formatCpData: function (data, id, code) {
    code = code ? code : data.data[id].area_code;
    var cp = areaCpData(data.data[id].scps, code);
    if (!cp) {
      console.log('Do not have id is '+ id +' layer data.');
      return null; 
    } 
    return { cp:cp,  areaList: data.data[id].area_list}; 

    function areaCpData(data, code) {
      for (var i = 0; i < data.length; i++) { 
        if (code == data[i].code) {
          return data[i];
        }
      }
      return null;
    }
  },
  formatDcp: function (data, id, code) {
    var dynamicData = {};
    var len = data.data[id].length;
    dynamicData.layerArr = [];
    dynamicData.dates = [];
    dynamicData.data = data.data[id];

    for (var i = len - 1; i >= 0; i--) {
      for(var j = 0; j < dynamicData.data[i].scp_list.length; j++) {
        if (code == dynamicData.data[i].scp_list[j].code) {
          dynamicData.scp = dynamicData.data[i].scp_list[j];

          dynamicData.area_code = dynamicData.data[0].area_code;
          
          break;
        }
      }

      var dateStr = dynamicData.data[i].target_time;
      dateStr = dateStr.split(' ')[0];
      dynamicData.layerArr.unshift(dynamicData.data[i].scp_list);
      dynamicData.dates.unshift(new Date(dateStr));
    }
    return dynamicData;
  },
  formatRepType: function (data) {
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        data[i].special_class = "report-common";
        data[i].special_label = "";
        if(data[i].is_new) {
          data[i].special_class = "report-new";
          data[i].special_label = "新";
        }else if(data[i].is_hot) {
          data[i].special_class = "report-hot";
          data[i].special_label = "热";
        }
      }
      return data;
    } else {
      console.log('There is something wrong with report type data.');
      return null;
    }
  },
  formatReportList: function (data) {
    for (var i = 0; i < data.length; i++) {
      data[i].report_class = "";
      data[i].report_label = "";
      data[i].vertical = "";
      data[i].time = data[i].content_time.split(' ')[0]; 
      // if($('.report-single').hasClass('vertical') || $('.vertical-btn').attr('class').indexOf('active') > 0) {
      //   data[i].vertical = ' vertical';
      // }
      if(data[i].is_new){
        data[i].report_class = "re-orange";
        data[i].report_label = "新";
      }
      else if(data[i].is_hot){
        data[i].report_class = "re-red";
        data[i].report_label = "热";
      }
    }

    return data;
  },
  formatReportVList: function (data, result) {
    result = result ? result : []
    if (data.length === 0) {
      return result
    }
    for (var i = 0; i < data.length; i++) {

      data[i].time = data[i].content_time.split(' ')[0];
      var year  = data[i].time.substr(0, 4),
        quarter = getQuarter(data[i].time.substr(5, 2))
      
      if (year === '0000') {
        continue
      }

      data[i].report_class = "";
      data[i].report_label = "";
      if(data[i].is_new){
        data[i].report_class = "re-orange";
        data[i].report_label = "新";
      }
      else if(data[i].is_hot){
        data[i].report_class = "re-red";
        data[i].report_label = "热";
      }


      var existYear = checkYear(result, year),
        existQuarter
      if (existYear) {
        existQuarter = checkQuarter(existYear, quarter)
        if (existQuarter) {
          existQuarter.push(data[i])
        } else {
          existYear.push({quarter: quarter, value: [data[i]]})
        }
      } else {
        existYear = []
        existYear.push({quarter: quarter, value: [data[i]]})
        result.push({year: year, value: existYear})
      }
    }

    function checkYear(data, year) {
      var current = null
      for (var i = 0; i < data.length; i++) {
        if (data[i].year === year) {
          current = data[i].value
          break
        }
      }
      return current
    } 

    function checkQuarter(data, quarter) {
      var current = null
      for (var i = 0; i < data.length; i++) {
        if (data[i].quarter === quarter) {
          current = data[i].value
          break
        }
      }
      return current
    } 

    function getQuarter(month) {
      var quarter = -1
      month = parseInt(month)
      switch(month) {
        case 1: case 2: case 3 : 
          quarter = 0
          break
        case 4: case 5: case 6 : 
          quarter = 1
          break
        case 7: case 8: case 9 : 
          quarter = 2
          break
        case 10: case 11: case 12 : 
          quarter = 3
          break
      }
      return quarter
    }
    
    return result;
  },
  formatAnalyze: function (_data, startDate, endDate, anIndex, pageSize) {
    var params = {
      startDate: startDate,
      endDate: endDate,
      data: _data.data,
      ENCN: true
    };
    var data = formatData.apiDataToPeriod(params);

    var analyze = {};
    analyze.tbData = [];
    analyze.pieData = data.Y;
    analyze.sum = data.X.length - 1;
    analyze.pageIndex = 0;
    analyze.totalPage = Math.ceil(analyze.sum / pageSize);

    var index = '', level, isGrow;

    for (var i = 0; i < data.X.length; i++) {
      anIndex = anIndex.remove('-1');
      anIndex = anIndex.remove('-5');
      index = anIndex;

      // data.Y[i] dosen't exist 
      if (!data.Y[i]) {
        analyze.tbData[i] = {};
        analyze.tbData[i].date = data.X[i];
        analyze.tbData[i].level = '－';
        analyze.tbData[i].levelClass = 'no-data';
        analyze.tbData[i].compare = '－';
        analyze.tbData[i].pieKey = index 
        analyze.tbData[i].pieIndex = "－";
        continue;
      }
      if (data.Y[i].misc.p == -9999) {
        data.Y[i].misc.p = '－';
      }

      level = data.Y[i].misc.lv;
      level = configData.productLegendConf[index][level]['name'];
      isGrow = (configData.growTarget.name.indexOf(index) >= 0);

      analyze.tbData[i] = {};
      analyze.tbData[i].date = data.X[i];
      analyze.tbData[i].level = level;
      analyze.tbData[i].levelClass = (data.Y[i].misc.lv + '-' + isGrow);
      analyze.tbData[i].compare = data.Y[i].misc.p;
      analyze.tbData[i].pieKey = index 
      analyze.tbData[i].pieIndex = i;

      // add class name
      analyze.tbData[i].className = 'evaluat-top icon-shangsheng';
      analyze.tbData[i].compare = analyze.tbData[i].compare.remove('%');
      if (analyze.tbData[i].compare == '－') {
        analyze.tbData[i].className = 'no-data';
      }
      else if (analyze.tbData[i].compare > 10) {
        analyze.tbData[i].compare += '%';
        analyze.tbData[i].className = 'evaluat-top icon-shangsheng';
      } else if (analyze.tbData[i].compare < -10) {
        analyze.tbData[i].compare += '%';
        analyze.tbData[i].className = 'evaluat-bottom icon-xiajiang';
      } else{
        analyze.tbData[i].compare += '%';
        analyze.tbData[i].className = 'evaluat-level icon-chiping';
      } 
    }

    return analyze;
  },
  formatWPLayerName: function (data) {
    for(var year in data.data) {
      for(var day in data.data[year]) {
        return data.data[year][day].tif_name;
      }
    }
    return null;
  },
  formatBounds: function (data) {
    var bounds = data.bounds;
    bounds = [bounds.lb_lon, bounds.lb_lat, bounds.rt_lon, bounds.rt_lat];
    return bounds;
  },
  formatMarkets: function (data) {
    if (data.status == '0') {
      var _count = 0
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].is_exist == 1) {
          _count += data.data[i].market_count
        }
      }
      if (data.data[0].area_name !=="全国") {
        data.data.sort(compareStr);
        data.data.unshift({
          area_id: "000000",
          area_name: "全国",
          is_exist: 1,
          market_count: _count
        });
      }
      return data.data;
    } else {
      return [];
      console.log(data.error_msg); 
    }

    function compareStr(obj1, obj2) {
      var str1 = pinyin.getCamelChars(obj1.area_name[0]);
      var str2 = pinyin.getCamelChars(obj2.area_name[0]);
      if (str1.localeCompare(str2) === 0) {
        return (str1 > str2);
      } else {
        return str1.localeCompare(str2);
      }
    }
  },
  formatMarketBar: function (data) {
    var bar = {};
    var _data = data.data;
    bar.xAxis = []; 
    bar.yAxis = [];
    for(var code in _data) {
      bar.xAxis.push(_data[code].area_name);
      bar.yAxis.push(_data[code].price);
    }
    return bar;
  },
  formatMarketLine: function (data) {
    var _data = data.data;
    var line = {};

    line.xAxis = [];
    line.yAxis = [];
    line.maxPrice = Number.NEGATIVE_INFINITY;

    for (var i = 0; i < _data.length; i++) {
      var point = _data[i];
      if (!point) {
        continue;
      }
      if (!point.date || !point.price) {
        console.log('API data format is very wrong!');
        continue;
      }

      var date = point.date.split(' ')[0];
      var price = point.price;

      if (line.maxPrice < price) {
        line.maxPrice = price;
      }
      if (price < 0) {
        price = '-';
      }

      line.yAxis.push(price);
      line.xAxis.push(date);
    }

    if (line.maxPrice < 0) {
      line.maxPrice = 0;
    }
    return line;
  },
  formatPriceLine: function (data) {
    var price = {};
    var _data = data.data;
    price.data = _data.prices,
    price.maxPrice = 0,
    price.startDate = dateUtil.formatDateZH(new Date( _data.start_date.split(' ')[0])),
    price.endDate = dateUtil.formatDateZH(new Date( _data.end_date.split(' ')[0]));

    price.xAxis = [];
    price.yAxis = [];
    for (var i = 0; i < price.data.length; i++) {
      var date = price.data[i].date.split(' ')[0];
      if (price.maxPrice < price.data[i].price) {
        price.maxPrice = price.data[i].price;
      }
      if (price.data[i].price < 0) {
        price.data[i].price = '-';
      }
      price.yAxis.push(price.data[i].price);
      price.xAxis.push(date);
    }
    return price;
  },
  formatMarketInfo: function (data) {
    var markets = {};
    
    var _data = data.market_datas;
    markets.totalPage = data.total_page;
    markets.data = [];

    for (var i = 0; i < _data.length; i++) {
      markets.data[i] = {};
      markets.data[i].market_id = _data[i].market_id;
      markets.data[i].market_name = _data[i].market_name;
      markets.data[i].market_name = _data[i].market_name;
      markets.data[i].farm_product_name = data.farm_product_name;

      markets.data[i].rateFlag = configData.market.rateFlag[_data[i].date_flag];
      if (!_data[i].cur_price) {
        markets.data[i].cur_price = '<span class="no-cur-data">-暂无-</span>';
        markets.data[i].desc = '<span class="no-cur-data">-暂无-</span>';
        markets.data[i].color = 'market-gray';
      } else { 
        markets.data[i].price = _data[i].cur_price.toFixed(2);
        if (_data[i].cur_price - _data[i].pre_price == 0) {
          markets.data[i].color = 'market-blue';
          markets.data[i].desc = '持平';
          markets.data[i].image = 'market-blue icon-chiping';
          markets.data[i].delta = '';
        } else if (_data[i].cur_price - _data[i].pre_price > 0) {
          markets.data[i].color = 'market-red';
          markets.data[i].image = 'market-red icon-shangsheng';
          markets.data[i].desc = '上升' + Number(_data[i].ratio).toFixed(2) + '%';
          markets.data[i].delta = (_data[i].cur_price - _data[i].pre_price).toFixed(2);
        } else {
          markets.data[i].color = 'market-green';
          markets.data[i].image = 'market-green icon-xiajiang';
          markets.data[i].desc = '下降' + Number(_data[i].ratio).toFixed(2) + '%';
          markets.data[i].delta = (_data[i].pre_price - _data[i].cur_price).toFixed(2);
        }
      }
    }
    return markets;
  },
  formatMarketNews: function (data) {
    var news = {};
    news.data = [];
    news.content = [];
    news.total = data.total;
    var _data =data.data;

    for(var i = 0;i < _data.length; i++){
      var publish_time = new Date(_data[i].publish_time).getTime(),
        timestamp = new Date().getTime(),
        paragraph = _data[i].main_body.replace(/<\/?.+?>/g,"");

      news.data[i] = {};
      news.data[i].news_img = _data[i].news_img;
      news.data[i].title = _data[i].title;
      news.data[i].publish_time = getTimeToNow(timestamp, publish_time, _data[i].publish_time);
      news.data[i].paragraph = paragraph;
      news.data[i].i = i;

      news.content[i] = _data[i];
      news.content[i].publish_time = news.data[i].publish_time
      news.content[i].label = _data[i].label ? _data[i].label : "";
      news.content[i].source = _data[i].source ? _data[i].source : "";
      news.content[i].paragraph = paragraph;
    }

    return news;

    function getTimeToNow(timestamp, publishtamp, publishTime) {
      var time ,
        second = parseInt(timestamp - publishtamp) / 1000,
        day = parseInt(second / 60 / 60 / 24),
        hour = parseInt(second / 60 / 60),
        minute = parseInt(second / 60);

      if (day < 7 && day >= 1){
        time = day + '天前';
      } else if (hour < 24 && hour >= 1){
        time = hour + '小时前';
      } else if (minute < 60 && second >= 60){
        time = minute + '分钟前';
      } else if (second < 60){
        time = '1分钟前';
      } else {
        time = publishTime.split(' ')[0].replace('-','年').replace('-','月') + '日';
      }
      return time;
    }
  },
  formatTdtPoi: function (data) {
    var point = {};
    var begin = data.indexOf('{');
    var end = data.lastIndexOf('}') + 1;
    var text = data.substring(begin, end);
    var poiObject = JSON.parse(text);

    if (poiObject.status == 0) {
      point.poi = poiObject.result;
      return point;
    } else {
      point.poi = null;
      return point;
    }
  },
  formateEnterprise: function (data) {
    var result = []
    for (var i = 0; i < data.length; i++) {
      result[i].id = data[i].id
      result[i].name = data[i].name
      result[i].geom = data[i].geom
    }
    return result
  }
}