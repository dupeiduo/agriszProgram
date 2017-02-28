<template>
  <div class="scale-atbottom">
    <my-map class="map" 
      v-loading.body="mapLoading"
      @initMap="initMap" 
      :switchCtl="true"
      background="#31c37c"
      :top="120"
      borderRadius="4px"
      :centerCtl="{use: true, bounds: bounds}"
      :addTileAreas="{code: code, areas: tree}" ref="map"></my-map>

    <div v-if="showTip" class="map-tooltip" :style="{top: tipInfo.top +'px', left: tipInfo.left + 'px'}">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="21.184px" viewBox="0 0 30 21.184" enable-background="new 0 0 30 21.184" xml:space="preserve">
        <path fill="#FFFFFF" d="M22.982,5.871c-1.666-3.067-4.927-5.026-8.437-5.026c-4.877,0-8.83,3.412-9.472,8.042
        c-2.453,0.552-4.291,2.746-4.291,5.362c0,3.031,2.466,5.498,5.498,5.498c1.275,0,2.462-0.414,3.416-1.179
        c1.538,0.985,3.131,1.466,4.849,1.466c1.624,0,2.728-0.258,3.995-0.961c1.081,0.629,2.301,0.961,3.566,0.961
        c3.921,0,7.109-3.188,7.109-7.108C29.217,9.301,26.492,6.304,22.982,5.871z"></path>
      </svg>
      <div class="">
        <h3 class="h3-tooltip">{{tipInfo.head}}</h3>
        <p class="p-tooltip">{{tipInfo.body}}</p>
      </div>
    </div>
    <my-dialog class="echart-dialog" 
      v-loading.body="chartLoading"
      v-show="echartVisible"
      @close="echartVisible = false"
      :overFlow="'none'"
      titleHeight="0"
      titlePadding="0" >

      <div class="chart-menu no-select" slot="title">
        <ul>
          <li @click="index='tem'" 
            :class="index ==='tem' ? 'active' : ''">
            <p style="background: #ddebba"></p>
            <i class="iconfont icon-qiwen" style="color: rgb(165, 194, 94)"></i> 气温</li>
          <li @click="index='gst'"
            :class="index ==='gst' ? 'active' : ''">
            <p style="background: #90dbd9"></p>
            <i class="iconfont icon-diwen-" style="color: rgb(3, 150, 147)"></i> 地温</li>
          <li @click="index='temacc'"
            :class="index ==='temacc' ? 'active' : ''">
            <p style="background: #fae4ad"></p>
            <i class="iconfont icon-jiwen-" style="color: rgb(229, 162, 0)"></i> 积温</li>
          <li @click="index='ssd'"
            :class="index ==='ssd' ? 'active' : ''">
            <p style="background: #fcd8d7"></p>
            <i class="iconfont icon-rizhao-" style="color: rgb(214, 87, 93)"></i> 日照</li>
          <li @click="index='pre'"
            :class="index ==='pre' ? 'active' : ''">
            <p style="background: #a1e0fc;"></p>
            <i class="iconfont icon-jiangshui-" style="color: rgb(10, 147, 212)"></i> 降水</li>
        </ul>
      </div>

      <my-echart class="pop-chart" slot="content"
      :options="chartOption"></my-echart>
        
    </my-dialog>

    <div v-if="wpLayer" class="wp-date">
      <h3>{{wpConfig.name}}</h3>
      <input type="button" @click="minusOneDay" class="btn fl" value="<">
      <el-date-picker class="date-picker fl"
        v-model="wpDate"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <input type="button"  @click="addOneDay" class="btn fl" value=">">
    </div>
    <weath-product class="left-list"
      :listData="listData"
      @ctlOpacity="ctlOpacity"
      @addWpLayer="addWpLayer"></weath-product>
    
    
    <div v-if="wpConfig" class="we-legend">
      <h3>图例</h3>
      <ul class="we-legend-ul">
        <el-tooltip
          effect="dark" 
          v-for="(item, index) in wpConfig.legend"
          :content="item.value" placement="left">
          <li
            :style="{background: item.color, height: height + 'px'}">
            <span class="we-legend-active">{{item.show}}</span>
          </li>
        </el-tooltip>
          
      </ul>
    </div>

    <img v-if="noWpData" class="no-data ps" src="static/assets/img/common/no-data.png" width="215" style="display: inline;">
    <viewreport @loadReport="loadReport" :reportName="reportName">
        <reportlist 
            slot="reportList"
            :reportContent="reportContent"
            @scrollToBottom="scrollToBottom" 
            :clientH="clientH"
            >
       </reportlist>
    </viewreport>
    <footer-lite></footer-lite>
  </div>
</template>

<script>
  import request from 'api/request.js'
  import model from 'api/model.js'
  import mapctl from './mapctl/index.js'
  import echart from './echart/index.js'
  import {dateUtil} from 'plugins/utils.js'
  import weathProduct from './product'
  import configData from '../../config/data.js'
  import config from 'config/env/config.env.js'
  import format from 'api/model.js'
  import viewreport from 'components/viewReport'
  import reportlist from 'components/reportList'
  import footerLite from 'components/footerlite'

  export default{
    data(){
      return {
        styleCtl:'',
        clientH:400,
        tree: [],
        code: null,
        bounds: [],
        showTip: false,
        tipInfo: {top: -100, left: -100, head: '', body: ''},
        stationId: null,
        stationInfo: null,
        index: '',
        chartConfig: {
          startDate: '1991-01-01',
          endDate: dateUtil.formatDate(new Date())
        },
        chartOption: {},
        chartLoading: false,
        echartVisible: false,
        listData: configData.weatherProduct,
        wpDate: new Date(),
        wpLayer: null,
        wpConfig: null,
        noWpData: false,
        height: 0,
        reportContent: [],
        reportName: '气象数据报告',
        perPage: 20,
        curPage: 1,
        total: -1,
        mapLoading: true,
        opacity: 90
      }
    },
    mounted() {
      request.cantonTree().then((response) => {
        if (response && response.status === 200) {
          this.tree = response.data
          this.code = response.data[0].area_id
          this.bounds =  model.formatBounds(response.data[0])
          this.mapLoading = false
        }
      })

      request.weatherStations().then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          mapctl.renderStations(response.data, this)
        }
      })

      this.$on('hoverPoint', (tipInfo) => {
        this.showTip = true
        this.tipInfo = tipInfo
      })
      this.$on('outPoint', () => {
        this.showTip = false
      })
      this.$on('clickPoint', (station) => {
        this.stationId = station.stationId
        this.stationInfo = station.currentStation
        this.echartVisible = true
      })
    },
    methods: {
      loadReport() {
        if (this.reportContent.length === 0) {
          this.getReportList(this.perPage, 1)
        }
      },
      initMap (map) {
        this.map = map;
      },
      addOneDay() {
        var date = new Date(this.wpDate)
        date.setDate(date.getDate() + 1)
        this.wpDate = dateUtil.formatDate(date)
      },
      minusOneDay() {
        var date = new Date(this.wpDate)
        date.setDate(date.getDate() - 1)
        this.wpDate = dateUtil.formatDate(date)
      },
      getChart() {
        var options = {
          stationId: this.stationId,
          index: this.index,
          startDate: this.chartConfig.startDate,
          endDate: this.chartConfig.endDate
        }
        this.chartLoading = true
        request.weatherFeature(options).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            this.chartOption = echart.formatChartData(response.data, this.chartConfig)
          }
          this.chartLoading = false
        });
      },
      setTitle(config) {
        if (this.stationInfo.hasName) {
          this.chartConfig.head = `${this.chartConfig.title} - ${this.stationInfo.name}站`
        } else {
          this.chartConfig.head = `站点${this.stationInfo.name} - ${this.chartConfig.title}`;
        }
      },
      addWpLayer(config) {
        this.mapLoading = true
        this.wpConfig = config
        this.height = (100 / this.wpConfig.legend.length).toFixed(0)
        if (this.wpLayer) {
          this.map.removeLayer(this.wpLayer)
        }
        var options = {
          areaCode: config.area_code,
          type: config.source_type,
          index: config.atomos_index,
          grade: config.grade
        }
        request.atmosRecent(options).then((response) => {
          if (response.status != 200 || response.data.status != 0 ) {
            this.noWpData = true
            this.mapLoading = false
          } else {
            this.wpDate = dateUtil.dayToDate(response.data.data.year, response.data.data.day);
          }
        });
      },
      ctlOpacity(value) {
        this.opacity = value
        if (this.wpLayer) {
          this.wpLayer.setOpacity(value/100)
        }
      },
      getLayerName(options) {
        if (this.wpLayer) {
          this.map.removeLayer(this.wpLayer)
        }
        request.getLayerName(options).then((response) => {
          if (response.status != 200 || response.data.status != 0) {
            // no data
            this.noWpData = true
            this.mapLoading = false
          } else {
            var layerName = model.formatWPLayerName(response.data);
            this.getBounds(layerName, this.wpConfig);
            this.noWpData = false
          }
        })
      },
      getBounds(layerName, wpConfig) {
        request.areaBounds(wpConfig.area_code).then((response) => {
          if (response.status !== 200 || response.data.status !== 0) {
            console.log('Area bounds data wrong!' + response.data.error_msg);
            addLayer(null, layerName);
            this.mapLoading = false
          } else {
            var  bounds = model.formatBounds(response.data.data);
            var sldBody = wpConfig.sldBody;
            this.addLayer(bounds, layerName,  sldBody);
          }
          this.mapLoading = false
        })
      },
      addLayer (bounds, layerName, sldBody) {
        var extent = bounds ?
           ol.extent.applyTransform(bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
           : null;

        var layerOptions = {
          serverUrl: config.mapUrl,
          visible: true,
          extent: extent,
          layerName: "map:" + layerName,
          sld: this.sld("map:" + layerName, sldBody),
          opacity: this.opacity/100,
          inRemoveList: true,
          callback: function (layer) {
            var container = $('#viewtarget-slide-bg');
            var slider = $('#viewtarget-slide-bg i');
            Global.layerOpacityCtl(layer, container, slider);
          }
        }
        this.wpLayer = this.$refs['map'].addGeoLayer(layerOptions, this.map);
      },
      sld (layerName, sldBody) {
        var sld = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">' +
        '<NamedLayer>' +
        '<Name>' + layerName + '</Name>' +
        '<UserStyle>' +
        '<Title>SLD Cook Book: Discrete colors</Title>' +
        '<FeatureTypeStyle>' +
        '<Rule>' +
        '<RasterSymbolizer>' +
        sldBody +
        '</RasterSymbolizer>' +
        '</Rule>' +
        '</FeatureTypeStyle>' +
        '</UserStyle>' +
        '</NamedLayer>' +
        '</StyledLayerDescriptor>';
        return sld;
      },
      getReportList(perPage, curPage) {
        var formated = format.formatReports,
          params = new FormData();
        params.append('section', 'weather');
        params.append('perPage', perPage);
        params.append('curPage', curPage);
        request.sectionRepor(params).then((requestData) => {
          this.total = requestData.data.total;
          if (this.curPage == 1) {
            this.reportContent = formated(requestData.data)
          } else {
            this.reportContent = this.reportContent.concat(formated(requestData.data))
          }
        })
      },
      scrollToBottom() {
          if (this.total && this.total <= this.perPage * this.curPage) {
            return
          }
          this.curPage += 1;
          this.getReportList(this.perPage, this.curPage)
        }

    },
    watch: {
      stationId: function(id) {
        if (this.index == '') {
          this.index = 'pre'
        } else {
          this.setTitle()
          this.getChart()
        }
      },
      index: function (index) {
        if (this.stationId) {
          this.chartConfig = echart.setChartConfig(index, this.chartConfig)
          this.setTitle()
          this.getChart()
        }
      },
      wpDate(date) {
        date = (date instanceof Date) ? dateUtil.formatDate(date) : date
        var options = {
          areaCode: this.wpConfig.area_code,
          type: this.wpConfig.source_type,
          index: this.wpConfig.atomos_index,
          grade: this.wpConfig.grade,
          date: date
        }
        this.getLayerName(options);
      }
    },
    components: {
      weathProduct,
      viewreport,
      reportlist,
      footerLite
    }
  }
</script>
<style lang="less" scoped>
  .map-tooltip {
    position: fixed;
    width: 180px;
    height: 48px;
    background: #fff;
    border-radius: 25px;
    svg {
      width: 28px;
      height: 28px;
      float: left;
      background: #f6b45a;
      border-radius: 19px;
      padding: 5px;
      margin: 4px 10px;
    }
    div {
      position: relative;
      top: 10px;
      h3 {
        font-size: 12px;
        font-weight: 400;
        color: #333;
      }
      p {
        font-size: 10px;
        font-weight: 400;
        color: #666;
      }
    }
  }
  .pop-chart {
    width: 700px;
    height: 350px;
  }
  .chart-menu {
    position: absolute;
    left: 0;
    top: -32px;
    overflow: hidden;
    height: 36px;
    border-radius: 8px 8px 0 0;
    background: #fff;
    ul {
      li {
        position: relative;
        float: right;
        overflow: hidden;
        width: 116px;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
        text-align: center;
        background: #f3f2f2;
        box-shadow: 0 0 17px #ecebeb;
        font-size: 12px;
        color: #333;
        font-weight: 500;
        p {
          position: absolute;
          top: 0;
          left: 0;
          width: 136px;
          height: 6px;
        }
        i {
          font-size: 20px;
          margin: 0 5px;
        }
      }
      .active {
        background: #fff;
      }
    }
  }
  .left-list {
    .left-tab {
      z-index: 2;
    }
  }
  .wp-date {
    position: relative;
    top: 80px;
    left: 60px;
    width: 200px;
    z-index: 1;
    h3 {
      position: relative;
      width: 200px;
      background: #fff;
      height: 35px;
      border-radius: 5px;
      line-height: 35px;
      font-size: 14px;
      text-align: center;
      box-shadow: 3px 3px 3px #e5e5e5;
    }
    .btn {
      display: inline-block;
      padding: 6px 11px;
      margin: 10px 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.42857143;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      background-image: none;
      border: 1px solid transparent;
      border-radius: 4px;
    }
    .date-picker {
      position: relative;
      width: 125px;
      margin: 0 3px;
      top: 10px;
    }
  }
  .no-data {
    z-index: 2;
    top: 50%;
    left: 50%;
    margin-top: -45px;
    margin-left: -108px;
  }
  .we-legend {
    position: fixed;
    right: 22px;
    bottom: 100px;
    width: 112px;
    padding: 10px;
    border-radius: 5px;
    background: rgba(255,255,255,.8);
    box-shadow: 0 1px 6px #acacac;

    h3 {
      font-size: 12px;
      margin-bottom: 10px;
    }
    ul {
      height: 100px;
      li {
        position: relative;
        width: 16px;
        span {
          position: absolute;
          top: 0;
          left: 34px;
          display: none;
          width: 150px;
          text-align: left;
          display: block;
        }
      }
    }
  }
</style>