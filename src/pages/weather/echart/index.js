import {
  formatData
} from 'plugins/utils.js'

export default {
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
        type: 'inside',
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
    
  }
}