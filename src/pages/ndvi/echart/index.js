export default {
  allLine(line) {
    var options = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        max: 0.8,
        min: 0,
        splitLine: {
          show: false
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '20px',
        bottom: '3%',
        containLabel: true
      },
      visualMap: {
            show: false,
            pieces: [
              {gt: 0.0078125, lte: 0.015625, color: "#b4b5b8"},
              {gt: 0.0078125, lte: 0.0234375, color: "#b5b7ba"},
              {gt: 0.0078125, lte: 0.03125, color: "#b7b8bb"},
              {gt: 0.0078125, lte: 0.0390625, color: "#b8babd"},
              {gt: 0.0078125, lte: 0.046875, color: "#babcbe"},
              {gt: 0.0078125, lte: 0.0546875, color: "#bbbdbf"},
              {gt: 0.0078125, lte: 0.0625, color: "#bdbfc1"},
              {gt: 0.0078125, lte: 0.0703125, color: "#bec0c2"},
              {gt: 0.0078125, lte: 0.078125, color: "#bfc1c3"},
              {gt: 0.0078125, lte: 0.0859375, color: "#c1c2c5"},
              {gt: 0.0078125, lte: 0.09375, color: "#c2c4c6"},
              {gt: 0.0078125, lte: 0.1015625, color: "#c4c5c8"},
              {gt: 0.0078125, lte: 0.109375, color: "#c5c7c9"},
              {gt: 0.0078125, lte: 0.1171875, color: "#c7c8cb"},
              {gt: 0.0078125, lte: 0.125, color: "#c8cacc"},
              {gt: 0.0078125, lte: 0.1328125, color: "#caccce"},
              {gt: 0.0078125, lte: 0.140625, color: "#cbcdcf"},
              {gt: 0.0078125, lte: 0.1484375, color: "#ccced0"},
              {gt: 0.0078125, lte: 0.15625, color: "#cdcfd1"},
              {gt: 0.0078125, lte: 0.1640625, color: "#cfd1d3"},
              {gt: 0.0078125, lte: 0.171875, color: "#d1d3d5"},
              {gt: 0.0078125, lte: 0.1796875, color: "#d2d4d6"},
              {gt: 0.0078125, lte: 0.1875, color: "#d4d6d8"},
              {gt: 0.0078125, lte: 0.1953125, color: "#d5d6d9"},
              {gt: 0.0078125, lte: 0.203125, color: "#d6d8da"},
              {gt: 0.0078125, lte: 0.2109375, color: "#d8d9db"},
              {gt: 0.0078125, lte: 0.21875, color: "#d9dadc"},
              {gt: 0.0078125, lte: 0.2265625, color: "#dbdcde"},
              {gt: 0.0078125, lte: 0.234375, color: "#dcdee0"},
              {gt: 0.0078125, lte: 0.2421875, color: "#9e1300"},
              {gt: 0.0078125, lte: 0.25, color: "#a71500"},
              {gt: 0.0078125, lte: 0.2578125, color: "#b51800"},
              {gt: 0.0078125, lte: 0.265625, color: "#bc1900"},
              {gt: 0.0078125, lte: 0.2734375, color: "#c41b00"},
              {gt: 0.0078125, lte: 0.28125, color: "#d31e00"},
              {gt: 0.0078125, lte: 0.2890625, color: "#de1f00"},
              {gt: 0.0078125, lte: 0.296875, color: "#ee2300"},
              {gt: 0.0078125, lte: 0.3046875, color: "#f82500"},
              {gt: 0.0078125, lte: 0.3125, color: "#ff2e00"},
              {gt: 0.0078125, lte: 0.3203125, color: "#ff3700"},
              {gt: 0.0078125, lte: 0.328125, color: "#ff4600"},
              {gt: 0.0078125, lte: 0.3359375, color: "#ff4e00"},
              {gt: 0.0078125, lte: 0.34375, color: "#ff5600"},
              {gt: 0.0078125, lte: 0.3515625, color: "#ff6600"},
              {gt: 0.0078125, lte: 0.359375, color: "#ff6d00"},
              {gt: 0.0078125, lte: 0.3671875, color: "#ff7b00"},
              {gt: 0.0078125, lte: 0.375, color: "#ff8300"},
              {gt: 0.0078125, lte: 0.3828125, color: "#ff9500"},
              {gt: 0.0078125, lte: 0.390625, color: "#ff9b00"},
              {gt: 0.0078125, lte: 0.3984375, color: "#fea900"},
              {gt: 0.0078125, lte: 0.40625, color: "#ffae00"},
              {gt: 0.0078125, lte: 0.4140625, color: "#ffb300"},
              {gt: 0.0078125, lte: 0.421875, color: "#ffc000"},
              {gt: 0.0078125, lte: 0.4296875, color: "#ffc400"},
              {gt: 0.0078125, lte: 0.4375, color: "#ffd000"},
              {gt: 0.0078125, lte: 0.4453125, color: "#ffd400"},
              {gt: 0.0078125, lte: 0.453125, color: "#ffe100"},
              {gt: 0.0078125, lte: 0.4609375, color: "#ffe700"},
              {gt: 0.0078125, lte: 0.46875, color: "#fef000"},
              {gt: 0.0078125, lte: 0.4765625, color: "#fff600"},
              {gt: 0.0078125, lte: 0.484375, color: "#fefb00"},
              {gt: 0.0078125, lte: 0.4921875, color: "#f3f600"},
              {gt: 0.0078125, lte: 0.5, color: "#edf400"},
              {gt: 0.0078125, lte: 0.5078125, color: "#e3f000"},
              {gt: 0.0078125, lte: 0.515625, color: "#dced00"},
              {gt: 0.0078125, lte: 0.5234375, color: "#d2e800"},
              {gt: 0.0078125, lte: 0.53125, color: "#cce600"},
              {gt: 0.0078125, lte: 0.5390625, color: "#c1e100"},
              {gt: 0.0078125, lte: 0.546875, color: "#bade00"},
              {gt: 0.0078125, lte: 0.5546875, color: "#b4db00"},
              {gt: 0.0078125, lte: 0.5625, color: "#aad800"},
              {gt: 0.0078125, lte: 0.5703125, color: "#a5d500"},
              {gt: 0.0078125, lte: 0.578125, color: "#99d000"},
              {gt: 0.0078125, lte: 0.5859375, color: "#93cc00"},
              {gt: 0.0078125, lte: 0.59375, color: "#87c300"},
              {gt: 0.0078125, lte: 0.6015625, color: "#82c000"},
              {gt: 0.0078125, lte: 0.609375, color: "#75b700"},
              {gt: 0.0078125, lte: 0.6171875, color: "#70b300"},
              {gt: 0.0078125, lte: 0.625, color: "#6aaf00"},
              {gt: 0.0078125, lte: 0.6328125, color: "#5ea600"},
              {gt: 0.0078125, lte: 0.640625, color: "#5aa400"},
              {gt: 0.0078125, lte: 0.6484375, color: "#4c9a00"},
              {gt: 0.0078125, lte: 0.65625, color: "#489801"},
              {gt: 0.0078125, lte: 0.6640625, color: "#3b8f00"},
              {gt: 0.0078125, lte: 0.671875, color: "#368b00"},
              {gt: 0.0078125, lte: 0.6796875, color: "#298200"},
              {gt: 0.0078125, lte: 0.6875, color: "#247f01"},
              {gt: 0.0078125, lte: 0.6953125, color: "#1f7b00"},
              {gt: 0.0078125, lte: 0.703125, color: "#127a00"},
              {gt: 0.0078125, lte: 0.7109375, color: "#127900"},
              {gt: 0.0078125, lte: 0.71875, color: "#127800"},
              {gt: 0.0078125, lte: 0.7265625, color: "#127700"},
              {gt: 0.0078125, lte: 0.734375, color: "#127600"},
              {gt: 0.0078125, lte: 0.7421875, color: "#127500"},
              {gt: 0.0078125, lte: 0.75, color: "#127400"},
              {gt: 0.0078125, lte: 0.7578125, color: "#127300"},
              {gt: 0.0078125, lte: 0.765625, color: "#127200"},
              {gt: 0.0078125, lte: 0.7734375, color: "#127100"},
              {gt: 0.0078125, lte: 0.78125, color: "#127000"},
              {gt: 0.0078125, lte: 0.7890625, color: "#126f00"},
              {gt: 0.0078125, lte: 0.796875, color: "#126e00"},
              {gt: 0.0078125, lte: 0.8046875, color: "#126d00"},
              {gt: 0.0078125, lte: 0.8125, color: "#126c00"},
              {gt: 0.0078125, lte: 0.8203125, color: "#126b00"},
              {gt: 0.0078125, lte: 0.828125, color: "#116b00"},
              {gt: 0.0078125, lte: 0.8359375, color: "#106b00"},
              {gt: 0.0078125, lte: 0.84375, color: "#0f6b00"},
              {gt: 0.0078125, lte: 0.8515625, color: "#0e6b00"},
              {gt: 0.0078125, lte: 0.859375, color: "#0d6b00"},
              {gt: 0.0078125, lte: 0.8671875, color: "#0c6b00"},
              {gt: 0.0078125, lte: 0.875, color: "#0b6b00"},
              {gt: 0.0078125, lte: 0.8828125, color: "#0a6b00"},
              {gt: 0.0078125, lte: 0.890625, color: "#096b00"},
              {gt: 0.0078125, lte: 0.8984375, color: "#086b00"},
              {gt: 0.0078125, lte: 0.90625, color: "#076b00"},
              {gt: 0.0078125, lte: 0.9140625, color: "#076b01"},
              {gt: 0.0078125, lte: 0.921875, color: "#076b02"},
              {gt: 0.0078125, lte: 0.9296875, color: "#076b03"},
              {gt: 0.0078125, lte: 0.9375, color: "#076b04"},
              {gt: 0.0078125, lte: 0.9453125, color: "#076b05"},
              {gt: 0.0078125, lte: 0.953125, color: "#076b06"},
              {gt: 0.0078125, lte: 0.9609375, color: "#076b07"},
              {gt: 0.0078125, lte: 0.96875, color: "#076b08"},
              {gt: 0.0078125, lte: 0.9765625, color: "#076b09"},
              {gt: 0.0078125, lte: 0.984375, color: "#076b0a"},
              {gt: 0.0078125, lte: 0.9921875, color: "#076b0b"},
              {gt: 0.0078125, lte: 1, color: "#076b0c"},
              {gt: 0.0078125, lte: 1.0078125, color: "#076b0d"},
            ]
        },
      series: [{
          name: 'NDVI值',
          type: 'line',
          symbol: 'circle',
          showAllSymbol: true,
          hoverAnimation: false,
          lineStyle:{
            normal:{
              width: 5,
            }
          },
          data: line.data,
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
            data: line.diffYear
          },
      }]
    }
    return options
  },
  landPie(pie) {
    var options = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} ({d}%)"
      },
      color: ['#f89406','#fb7183','#4183d7','#34c3fe'],
      series: [{
        hoverAnimation: false,　
        name: '地块类型',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: pie,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    return options
  }
}