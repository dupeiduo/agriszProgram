export default {
    getPie: function (data) {
      var color = []
      for (var i = 0; i < data.length; i++) {
        color.push(data[i].color)
      }
        var option = {
            color: color,
            series : [
              {   
                hoverAnimation: false,
                type: 'pie',
                radius : '55%',
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
