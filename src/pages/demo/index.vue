<template>
  <div>
    
    <div class="input-container">
      <el-input v-model="offsets[0]" placeholder="请输入边界0"></el-input>
      <el-input v-model="offsets[1]" placeholder="请输入边界1"></el-input>
      <el-input v-model="offsets[2]" placeholder="请输入边界2"></el-input>

    </div>

    <div class="input-container margin300">
      <el-input v-model="colors[0]" placeholder="请输入颜色0"></el-input>
      <el-input v-model="colors[1]" placeholder="请输入颜色1"></el-input>
      <el-input v-model="colors[2]" placeholder="请输入颜色2"></el-input>
    </div>

    <div class="input-container margin600">
      <el-switch
        v-model="useGradient"
        on-text="渐变"
        off-text="不渐变"
        on-color="#13ce66"
        off-color="#ff4949">
      </el-switch>

      
      <el-button type="primary" @click="setOptions">刷新图表</el-button>
    </div>
    <my-echart
      v-if="options"
      :options="options"
      class="pie-chart-body"
      >
      </my-echart>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: null,
        offsets: [0, 0.5, 1],
        colors: ["red", "green", "blue"],
        useGradient: false
      }
    },
    mounted() {
      this.setOptions()
    },
    methods: {
      setOptions() {
        var formated = this.getApiData()

        if (this.useGradient) {
          this.options = this.getGradientOption(formated)
        } else {
          this.options = this.getBlockOption(formated)
        }
      },
      getGradientOption(formated) {
        var options = {
          xAxis: {
              type: 'category',
              data: formated.ndviData
          },
          yAxis: {
              type: 'value'
          },
          series: [
            {
              name:'模拟数据',
              type:'line',
              smooth:true,
              symbol: 'none',
              sampling: 'average',
              areaStyle: {
                  normal: { 
                    color: {
                      type: "liner",
                      x: 0,
                      x2: 1,
                      y: 0,
                      y2: 0,
                      colorStops: this.getColorStops()
                    }
                  }
              },
              data: formated.areaData
            }
          ]
        }

        return options
      },
      getBlockOption(formated) {
        var options = {
          xAxis: {
              type: 'category',
              data: formated.ndviData
          },
          yAxis: {
              type: 'value'
          },
          series: [
            {
              name:'模拟数据',
              type:'line',
              smooth:true,
              symbol: 'none',
              sampling: 'average',
              markArea: 
              {
                silent: true,
                itemStyle:
                {
                  normal:
                  {
                    color: this.colors,
                    opacity: 0.8
                  }
                },
                data: [
                  [
                      {
                          yAxis: 0
                      },
                      {
                          yAxis: 3
                      }
                  ],
                  [
                      {
                          yAxis: 3
                      },
                      {
                          yAxis: 6
                      }
                  ],
                  [
                      {
                          yAxis: 6
                      },
                      {
                          yAxis: 9
                      }
                  ]
                ]
              },
              data: formated.areaData
            }
          ]
        }

        return options
      },
      getApiData() {
        var ndviData = [0,1,2,3,4,5,6,7,8,9];
        var areaData = [0,1,2,3,4,5,4,7,2,6];

        var result = {}
        result.ndviData = ndviData
        result.areaData = areaData

        return result
      },
      getColorStops() {
        var colors = []

        for (var i = 0; i < this.colors.length; i++) {
          var item = {
            offset: this.offsets[i],
            color: this.colors[i]
          }

          colors.push(item)
        }
        
        return colors
      }
    }
  }
</script>

<style lang="less" scoped>
  .pie-chart-body {
    position: absolute;
    top: 200px;
    width: 630px;
    height: 460px;
  }
  .input-container {
    position: absolute;
    top: 60px;
    width: 200px;
  }
  .margin300 {
    margin-left: 300px;
  }
  .margin600 {
    margin-left: 600px;
  }
</style>