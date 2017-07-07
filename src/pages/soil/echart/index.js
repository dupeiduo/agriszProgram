export default {
  getBarOption(data) {
    var option = {
      tooltip : {
        trigger: 'item',
        formatter: data.tips,
        position: "top"
        // backgroundColor: "#fff"
      },
      color: data.color,
      animation: false,
      series : [
        {
          hoverAnimation: false,
          type: 'pie',
          radius : '90%',
          center: ['50%', '50%'],
          label: {
            normal: {
              // show: false
              position: 'inner'
            }
          },
          data: data.bar,
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 1,
              borderType: 'solid',
            },
          }
        }
      ]
    };

    return option
  }
}