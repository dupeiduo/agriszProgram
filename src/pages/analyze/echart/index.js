export default {
  getPie: function (data) {
    var option = {
    title : {
      text: '',
      left: 'center',
      textStyle: {
        fontSize: 14,
      }
    },
    series: {
      hoverAnimation: false,
      type: 'pie',
      name: '面积占比',
      center:[ '50%','60%'],
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
          length2: 20
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
  }
}
