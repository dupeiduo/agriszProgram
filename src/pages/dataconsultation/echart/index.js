import {
  formatData
} from 'plugins/utils.js'

export default {
  getRainChart(xData,yData, name, dataZoom) {
    var  option = {
      title: {
        text: name,
        left: 'center',
        top: 5
      },
      tooltip : {
        trigger: 'axis',
        formatter: function (params) {
          var a = params[0].seriesName
          var b = params[0].axisValue
          var c = (params[0].value || typeof params[0].value === "number") ? params[0].value : "-"
          
          return `${b}<br/>${a} : ${c} mm`
        }
      },
      grid: {
        top: 20,
        bottom: 60,
        left: 50,
        right: 30
      },
      dataZoom: [
        {
          type: 'slider',
          start: dataZoom && dataZoom.start ? dataZoom.start : 80,
          end: dataZoom && dataZoom.end ? dataZoom.end : 100
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : true,
          data : xData
        }
      ],
      yAxis : [
        {
          type : 'value',
          splitLine: {
            show: false
          }
        }
      ],
      series : [
        {
          name: name,
          type: 'line',
          stack: '总量',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            normal: {
              width: 1
            }
        },
        markArea: {
          silent: true,
          itemStyle: {
            normal: {
              color: '#eef6fa',
              opacity: 0.8
            }
          },
        },
        itemStyle: {
          normal: {
            color: 'rgb(0, 80, 251)',
            width: 100
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0.5, 0, 1, [{
              offset: 0,
              color: '#a1dffd',
            }, {
              offset: 1,
              color: '#57c1f4',
            }])
          }
        },
          data: yData
        },
      ]
    }; 
    return option;
  },
  getTemChart(xData,yData, name, dataZoom) {
    var  option = {
      color: ['#739d0c'],
      title: {
        text: name,
        left: 'center',
        top: 5
      },
      tooltip : {
        trigger: 'axis',
        formatter: function (params) {
          var a = params[0].seriesName
          var b = params[0].axisValue
          var c = (params[0].value || typeof params[0].value === "number") ? params[0].value : "-"
          
          return `${b}<br/>${a} : ${c} ℃`
        }
      },
      grid: {
        top: 20,
        bottom: 60,
        left: 50,
        right: 30
      },
      dataZoom: [
        {
          type: 'slider',
          start: dataZoom && dataZoom.start ? dataZoom.start : 80,
          end: dataZoom && dataZoom.end ? dataZoom.end : 100
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : true,
          data : xData
        }
      ],
      yAxis : [
        {
          type : 'value',
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: name,
          type:'line',
          stack: '总量',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            normal: {
              width: 1
            }
          },
          data: yData
        }
      ]
    };
    return option
  },
  getTemsumChart(xData,yData, name, dataZoom) {
    var  option = {
      title: {
        text: name,
        left: 'center',
        top: 5
      },
      tooltip : {
        trigger: 'axis',
        formatter: function (params) {
          var a = params[0].seriesName
          var b = params[0].axisValue
          var c = (params[0].value || typeof params[0].value === "number") ? params[0].value : "-"
          
          return `${b}<br/>${a} : ${c} ℃`
        }
      },
      grid: {
        top: 20,
        bottom: 60,
        left: 40,
        right: 2
      },
      dataZoom: [
        {
          type: 'slider',
          start: dataZoom && dataZoom.start ? dataZoom.start : 80,
          end: dataZoom && dataZoom.end ? dataZoom.end : 100
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : true,
          data : xData
        }
      ],
      yAxis : [
        {
          type : 'value',
          splitLine: {
            show: false
          }
        }
      ],
      series : [
        {
          name: name,
          type: 'line',
          stack: '总量',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            normal: {
              width: 1
            }
        },
        markArea: {
          silent: true,
          itemStyle: {
            normal: {
              color: '#eef6fa',
              opacity: 1
            }
          },
        },
        itemStyle: {
          normal: {
            color: '#d6575d',
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0.5, 0, 1, [{
              offset: 0,
              color: '#e55100',
            }, {
              offset: 1,
              color: '#fada8d',
            }])
          }
        },
          data: yData
        },
      ]
    };
    return option;
  },
  getRainAverageChart(xData,yData, name, dataZoom) {
    var  option = {
      title: {
        text: name,
        left: 'center',
        top: 5
      },
      tooltip : {
        trigger: 'axis',
        formatter: function (params) {
          var a = params[0].seriesName
          var b = params[0].axisValue
          var c = (params[0].value || typeof params[0].value === "number") ? params[0].value : "-"
          
          return `${b}<br/>${a} : ${c} mm`
        }
      },
      grid: {
        top: 20,
        bottom: 60,
        left: 40,
        right: 2
      },
      dataZoom: [
        {
          type: 'slider',
          start: dataZoom && dataZoom.start ? dataZoom.start : 80,
          end: dataZoom && dataZoom.end ? dataZoom.end : 100
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : xData
        }
      ],
      yAxis : [
        {
          type : 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        }
      ],
      visualMap: {
        show: false,
        pieces: [{
            gt: -200,
            lte: 0,
            color: '#f60000'
        },{
            gt: 0,
            lte: 500,
            color: '#2f0ee1'
        }]
      },
      series : [
        {
          name: name,
          type: 'line',
          stack: '总量',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          lineStyle: {
            normal: {
              width: 1
            }
        },
        markArea: {
          itemStyle: {
            normal: {
              color: '#000',
            }
          },
        },
          data: yData
        },
      ]
    };
    return option
  },
  getTemAverageChart(xData, yData, name, dataZoom) {
    var  option = {
      title: {
        text: name,
        left: 'center',
        top: 5
      },
      tooltip : {
        trigger: 'axis',
        formatter: function (params) {
          var a = params[0].seriesName
          var b = params[0].axisValue
          var c = (params[0].value || typeof params[0].value === "number") ? Number(params[0].value).toFixed(0) : "-"
          
          return `${b}<br/>${a} : ${c} ℃`
        }
      },
      grid: {
        top: 20,
        bottom: 60,
        left: 60,
        right: 25
      },
      dataZoom: [
        {
          type: 'slider',
          start: dataZoom && dataZoom.start ? dataZoom.start : 80,
          end: dataZoom && dataZoom.end ? dataZoom.end : 100
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : xData
        }
      ],
      yAxis : [
        {
          type : 'value',
          splitLine: {
            show: false
          }
        }
      ],
      series : [
        {
          animation: false,
          name: name,
          type: 'line',
          stack: '总量',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          lineStyle: {
            normal: {
              width: 1
            }
          },
          markArea: {
            itemStyle: {
              normal: {
                color: '#000',
              }
            },
          },
          itemStyle: {
            normal: {
              color: '#d6575d',
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0.5, 0, 1, [{
                offset: 0,
                color: '#e55100',
              }, {
                offset: 1,
                color: '#fada8d',
              }])
            }
          },
          data: yData
        },
      ]
    };
    return option
  },
  getNumberByColor(color) {
    var num = parseInt(color, 16)
    
    return num
  },
  getColorByNumber(num) {
    var color = '0x0'+num.toString(16)

    return color
  },
  setChartConfig(index, config) {
    config.index = index
    switch (index) {
      case "tem":
        config.title = "气温";
        config.unit = "℃";
        config.legend = "气温";
        config.key = "TEM_Avg";
        config.showLegend = false;
        config.itemColor = '#739d0c';
        config.ColorTop = '';
        config.ColorBottom = '';
        return config
        break;
      case "pre":
        config.title = "降水量";
        config.unit = "mm";
        config.legend = "降水量";
        config.key = "PRE_20_20";
        config.showLegend = false;
        config.itemColor = 'rgb(0, 80, 251)';
        config.ColorTop = '#a1dffd';
        config.ColorBottom = '#57c1f4';
        return config
        break;
      case "ssd":
        config.title = "日照时长";
        config.unit = "h";
        config.legend = "日照时长";
        config.key = "SSD_Hours";
        config.showLegend = false;
        config.itemColor = '#d6575d';
        config.ColorTop = '#e4555c';
        config.ColorBottom = '#fcc8cb';
        return config
        break;
      case "gst":
        config.title = ["地表温度"];
        config.unit = "℃";
        config.legend = ["平均", "最高", "最低"];
        config.key = ["GST_Avg", "GST_Max", "GST_Min"];
        config.itemColor = '#d6575d';
        config.ColorTop = '#fcc8cb';
        config.ColorBottom = '#e4555c';
        config.showLegend = true;
        return config
        break;
      case "temacc":
        config.title = "积温";
        config.unit = "℃";
        config.legend = "积温";
        config.key = "TOTAL_TEM";
        config.itemColor = '#d6575d';
        config.ColorTop = '#e55100';
        config.ColorBottom = '#fada8d';
        return config
        break;
      default:
        break;
    }
  },
  formatChartData(data, chartConfig) {
    var options
    if (chartConfig.index == "temacc") {
      options = {
        startDate: new Date(chartConfig.startDate),
        endDate: new Date(chartConfig.endDate),
        data: data.data
      };
      var formated = formatData.apiDataToDay(options);
      var series = this.dayData(formated.Y, chartConfig)
      return this.getOption(series, chartConfig, formated.X)
    } else {
      options = {
        startDate: new Date(chartConfig.startDate),
        endDate: new Date(chartConfig.endDate),
        ENCN: true,
        data: data.data
      };
      var formated = formatData.apiDataToPeriod(options);
      var series = this.periodData(formated.Y, chartConfig)
      return this.getOption(series, chartConfig, formated.X)
    }
  },
  getOption: function(series, config, xdata) {
    // diwen
    var formatter = ''
    if (config.index == 'gst') {
      formatter = '{b0}<br/>{a0} : {c0} <br/>{a1} : {c1} <br/>{a2} : {c2}'
    } else {
      formatter = '{b}<br/>{a} : {c} '
    }
    return {
      title: {
        text: config.head,
        textStyle: {
          color: '#7e6139',
        }
      },
      tooltip: {
        trigger: 'axis',
        position: ['70%', '60'],
        formatter: formatter + config.unit
      },
      legend: {
        data: config.legend,
        show: config.showLegend,
        right: '5%',
        zlevel: 10
      },
      grid: {
        top: 50,
        bottom: 80
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdata
      },
      dataZoom: [{
        type: 'slider',
        start: 85,
        end: 100
      }, {
        start: 0,
        end: 10
      }],
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value} '
        }
      },
      series: series
    }
  },
  dayData: function(ydata, config) {
    var _ydata = [];
    for (var i = 0, len = ydata.length; i < len; i++) {
      if (ydata[i])
        _ydata.push(Number(ydata[i][config.key]).toFixed(2));
      else
        _ydata.push("-");
    }
    var series = [{
      name: config.title,
      type: 'line',
      stack: '总量',
      data: _ydata,
      smooth: true,
      symbol: 'none',
      lineStyle: {
        normal: {
          width: 1
        }
      },
      itemStyle: {
        normal: {
          color: config.itemColor,
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0.5, 0, 1, [{
            offset: 0,
            color: config.ColorTop,
          }, {
            offset: 1,
            color: config.ColorBottom,
          }])
        }
      }
    }];
    return series
  }

, periodData: function(ydata, config) {
    if (config.index == "gst") {
      var _avgdata = [],
        _maxdata = [],
        _mindata = [];
      for (var i = 0, len = ydata.length; i < len; i++) {
        if (ydata[i]) {
          _avgdata.push(Number(ydata[i][config.key[0]]).toFixed(2));
          _maxdata.push(Number(ydata[i][config.key[1]]).toFixed(2));
          _mindata.push(Number(ydata[i][config.key[2]]).toFixed(2));
        } else {
          _avgdata.push("-");
          _maxdata.push("-");
          _mindata.push("-");
        }
      }
      var series = [{
        name: "平均",
        type: 'line',
        data: _avgdata,
        smooth: true,
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#31c1c4'
          }
        },
        markArea: {
          silent: true,
          itemStyle: {
            normal: {
              color: '#eef6fa',
              opacity: 0.8
            }
          },
          data: this.lineDifColor(config)
        }
      }, {
        name: "最高",
        type: 'line',
        data: _maxdata,
        smooth: true,
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#e28db6'
          }
        }
      }, {
        name: "最低",
        type: 'line',
        data: _mindata,
        smooth: true,
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#78c431'
          }
        }
      }];

    } else if (config.index == "tem") {
      var _ydata = [];
      for (var i = 0, len = ydata.length; i < len; i++) {
        if (ydata[i])
          _ydata.push(Number(ydata[i][config.key]).toFixed(2));
        else
          _ydata.push("-");
      }
      // qiwen
      var series = [{
        name: config.title,
        type: 'line',
        stack: '总量',
        data: _ydata,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          normal: {
            width: 1
          }
        },
        markArea: {
          silent: true,
          itemStyle: {
            normal: {
              color: '#eef6fa',
              opacity: 0.8
            }
          },
          data: this.lineDifColor(config)
        },
        itemStyle: {
          normal: {
            color: config.itemColor,
            width: 100
          }
        },
        visualMap: {
          top: 10,
          right: 10,
          pieces: [{
            gt: 0,
            lte: 50,
            color: '#000'
          }, {
            gt: 100,
            lte: 100,
            color: 'blue'
          }, {
            gt: 120,
            lte: 150,
            color: '#ff9933'
          }],
          outOfRange: {
            color: 'red'
          }
        },
      }];

    } else {
      var _ydata = [];
      for (var i = 0, len = ydata.length; i < len; i++) {
        if (ydata[i])
          _ydata.push(Number(ydata[i][config.key]).toFixed(2));
        else
          _ydata.push("-");
      }
      var series = [{
        name: config.title,
        type: 'line',
        stack: '总量',
        data: _ydata,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          normal: {
            width: 1
          }
        },
        markArea: {
          silent: true,
          itemStyle: {
            normal: {
              color: '#eef6fa',
              opacity: 0.8
            }
          },
          data: this.lineDifColor(config)
        },
        itemStyle: {
          normal: {
            color: config.itemColor,
            width: 100
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0.5, 0, 1, [{
              offset: 0,
              color: config.ColorTop,
            }, {
              offset: 1,
              color: config.ColorBottom,
            }])
          }
        },
        visualMap: {
          top: 10,
          right: 10,
          pieces: [{
            gt: 0,
            lte: 50,
            color: '#000'
          }, {
            gt: 100,
            lte: 100,
            color: 'blue'
          }, {
            gt: 120,
            lte: 150,
            color: '#ff9933'
          }],
          outOfRange: {
            color: 'red'
          }
        },
      }];
    }
    return series
  },
  lineDifColor: function(config) {
    var yearColor = []
    var years = config.endDate.substr(0,4) - config.startDate.substr(0,4);
    for (var i = 0; i <= years; i++) {
      if (i % 2 != 0) {
        var arr = [{
          xAxis: (1991 + i - 1) + '-1-1'
        }, {
          xAxis: (1991 + i) + '-1-1'
        }];
        yearColor.push(arr);
      }
    }
    return yearColor
    
  },
  getGrowthLine: function (data) {
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      color:['#ff3607','#a1c7ee','#add985','#f7cc9b','#e5adc8'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '6%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.linexAxis
      },
      yAxis: {
        type: 'value',
        min: Number(data.minValue * 0.85).toFixed(0),
        max: Number(data.maxValue * 1.15).toFixed(0)
      },
      dataZoom: [{ 
        type: 'slider', 
        start: data.lineStart,
        end: 100
      }],
      series: [
      {
        zlevel: 6,
        name: '当年',
        lineStyle: {
          normal: {
            width: 3
          }
        },
        showSymbol: false,
        symbolSize: 6,
        type:'line',
        data: data.current,
        markArea: 
        {
          silent: true,
          itemStyle:
          {
            normal:
            {
              color:'#eef6fa',
              opacity: 0.8
            }
          },
          data: data.lineYearColor
        },
        areaStyle: {
          normal: {
            color: '#ff3607',
            opacity: 0.2
          }
        }
      },
      {
        name: '最高',
        lineStyle: {
              normal: {
                  width: 1.5,
              }
          },
        showSymbol: false,
        symbolSize: 3,
        type:'line',
        data: data.max,
        areaStyle: {
          normal: {
            color: '#a1c7ee',
            opacity: 0.2
          }
        }
      },
      {
        name: '最低',
        lineStyle: {
              normal: {
                  width: 1.5,
              }
          },
        showSymbol: false,
        symbolSize: 3,
        type:'line',
        data: data.min,
        areaStyle: {
          normal: {
            color: '#add985',
            opacity: 0.2
          }
        }
      },
      {
        name: '去年',
         lineStyle: {
              normal: {
                  width: 1.5
              }
          },
        showSymbol: false,
        symbolSize: 3,
        type:'line',
        data: data.previous,
        areaStyle: {
          normal: {
            color: '#ff3607',
            opacity: 0.2
          }
        }
      },
      {
        name: '平均',
        lineStyle: {
              normal: {
                  width: 1.5
              }
          },
        showSymbol: false,
        symbolSize: 3,
        type:'line',
        data: data.average,
        areaStyle: {
          normal: {
            color: '#e5adc8',
            opacity: 0.2
          }
        }
      }
      ]
    };
    return option;
  },
  getGrowthBar: function (data) {
    var barLegend = data.legend;
    var option = {
      tooltip : {
        position: ['80%', '50'],
        trigger: 'axis',
        axisPointer : {            
          type : 'shadow'        
        },
        formatter:'{b}<br>{a5} : {c5}%<br>{a4} : {c4}%<br>{a3} : {c3}%<br>{a2} : {c2}%<br>{a1} : {c1}%<br>{a0} : {c0}%'
      },
      legend: {
        show: false,
        data: [barLegend['6'].name, barLegend['5'].name, barLegend['4'].name, barLegend['3'].name, barLegend['2'].name, barLegend['1'].name]
      },
      toolbox: {  
        show: true,
        top: '5%',
        feature: { 
          magicType: { 
                      show: false
                    },
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top:'6%',
          containLabel: true
        },
        yAxis:  {
          type: 'value', 
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %'
          },
          min: 0,
          max: 100
        },
        xAxis: {
          type: 'category',
          data: data.parxAxis
        },
        animation: false,
        dataZoom: [{ 
          type: 'slider', 
          start: data.parStart,
          end: 100
        }],
        series: [
          {
            name: barLegend['1'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            data: data.data1,
            itemStyle:{
              normal:{color: barLegend['1'].color}
            }
          },
          {
            name: barLegend['2'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['2'].color}
            },
            data: data.data2
          },
          {
            name: barLegend['3'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['3'].color}
            },
            data: data.data3
          },
          {
            name: barLegend['4'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['4'].color}
            },
            data: data.data4
          },
          {
            name: barLegend['5'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['5'].color}
            },
            data: data.data5
          },
          {
            name: barLegend['6'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['6'].color}
            },
            data: data.data6
          }
        ]
    };
    return option;
  },
  getPie: function (data, title, center, animation) {
    var option = {
      title : {
        text: title,
        left: 'center',
        top: '10px',
        textStyle: {
          fontSize: 14,
        }
      },
      series: {
        animation: animation,
        hoverAnimation: false,　
        type: 'pie',
        name: '面积占比',
        center:[ '50%', '50%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 70,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            textStyle: {
              color: '#000'
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: '#000'
            },
            smooth: 0.2,
            length: 10,
            length2: 10
          }
        },
        data: data   
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%",
        backgroundColor: 'rgba(0,0,0,.4)'
      },
      xAxis: {
        show: false
      },
      yAxis: {
        show: false
      }
    }
    return option;
  },
  getRing: function (data) {
      var color = []
      for (var i = 0; i < data.length; i++) {
        color.push(data[i].color)
      }
        var option = {
            color: color,
            series : [
              {   
                animation: false,
                hoverAnimation: false,
                type: 'pie',
                radius : ['50%','70%'],
                center: ['50%', '50%'],
                data: data,
                label: {
                    normal: {
                        textStyle: {
                            color: '#000'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length: 1,
                        lineStyle: {
                            color: '#000'
                        }
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
            ]
        };

        return option;
    }
}