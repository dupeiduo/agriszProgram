export default {
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
        center:[ '50%', center +'%'],
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
  }
}
