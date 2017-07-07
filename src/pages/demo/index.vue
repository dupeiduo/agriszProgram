<template>
  <div>
    <my-map class="map" 
      @initMap="initMap" 
      :switchCtl="true"
      :top="97"
      borderRadius="4px"
      :maxZoom="18" ref="map"></my-map>

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

      <el-button type="primary" @click="removeAll">清空</el-button>

      <el-button type="primary" @click="startDraw">绘制</el-button>
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
import drawCtl from 'agrisz-map-polygon'
import request from 'api/request.js'
import axios from 'axios'


import modisLib from 'agrisz-lib-modis'
import {formatData, dateUtil} from '../../plugins/utils.js'
import config from 'config/env/config.env.js'
import configData from '../../config/data.js'

var layerCtl = modisLib(config.mapUrl, config.tileMapUrl, dateUtil, configData)
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

      this.initMarkeAreaRequest()
      this.initTileLayer()

      this.initAreaLayers()
    },
    methods: {
      initMap (map) {
        this.map = map;
        
        layerCtl.setRefrence(this.map, this.$refs.map)
      },
      initMarkeAreaRequest() {

        drawCtl.setRefrence(this.map)
        drawCtl.openClickEvent()

        
        drawCtl.drawPolygon((area, geom) => { 
          console.log(area, geom) 
          setTimeout(()=> {
            vueBus.$emit('doubleClickZoom', true)
          }, 1000)
        },
        ({id, index}) => { 
          if (id) {
            drawCtl.highlightById(id) 
            
          }
        }
        )

        // drawCtl.endDraw()

        var params = {
          type: 10,
          index: 'NDVI-1',
          code: 451229,
          start: '2016-02-1',
          end: '2016-02-10',
          status: 1
        }

        request.modisMarkerInfo(params).then((res) => {
          if (res && res.status === 200 && res.data.status === 0) {
            
            var data = res.data.data
            var geomtries = []
            for(var year in data) {

              for(var period in data[year]) {
                
                for (var i = 0; i < data[year][period].length; i++) {
                  var item = {
                    marker_id: data[year][period][i].marker_id,
                    title: data[year][period][i].title,
                    color: data[year][period][i].color,
                    geom: data[year][period][i].geom,
                    desc: data[year][period][i].desc
                  }
                  geomtries.push(item)
                  
                }
              }
            }
            console.log(geomtries)
            drawCtl.renderPolygons(geomtries)
          }
        })
        
      },
      startDraw() {
        drawCtl.setLineColor('red')
        vueBus.$emit('doubleClickZoom', false)
        drawCtl.startDraw()
      },
      removeAll() {
        drawCtl.removeDrawLayer()
        drawCtl.removePolygons()
      },
      initTileLayer() {
        var product = 'NDVI-1'
        var date = new Date('2016-06-12')
        
        var code = 451229
        var bounds = {
          lb_lat:23.5172919481806,
          lb_lon:107.26955719021001,
          rt_lat:24.4202728275966,
          rt_lon:108.091679382182
        }

        var tileLayer = layerCtl.addTileLayer(product, date, code, bounds)
      },
      initAreaLayers() {
        var areas = [
          {
            area_id:"451229",
            area_name:"大化瑶族自治县",
            bounds: {
              lb_lat:23.5172919481806,
              lb_lon:107.26955719021001,
              rt_lat:24.4202728275966,
              rt_lon:108.091679382182
            },
          }
        ]

        layerCtl.addAreaTileLayers(areas[0].area_id, areas)
      },
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
    width: 230px;
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