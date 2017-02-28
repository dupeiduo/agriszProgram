export default {
  getLine: function (data) {
    var option = {
      tooltip: {
        position: ['80%', '60'],
        trigger: 'axis'
      },
      color:['#3ac1c3','#f7cc9b','#a1c7ee','#add985','#e5adc8'],
      legend: {
        data:['当年','去年','最高','最低','平均'],
        right: 50,
        top: '0%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '14%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.linexAxis
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [{ 
        type: 'slider', 
        start: data.lineStart,
        end: 100
      }],
      series: [
      {
        name: '当年',
        lineStyle: {
          normal: {
            width: 3
          }
        },
        symbol: 'none',
        symbolSize: 10,
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
        }
      },
      {
        name: '去年',
         lineStyle: {
              normal: {
                  width: 1.5,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.previous
      },
      {
        name: '最高',
        lineStyle: {
              normal: {
                  width: 1.5,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.max
      },
      {
        name: '最低',
        lineStyle: {
              normal: {
                  width: 1.5,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.min
      },
      {
        name: '平均',
        lineStyle: {
              normal: {
                  width: 1.5,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.average
      }
      ]
    };
    return option;
  },
  getBar: function (data) {
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
          top:'5%',
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
  }
}
