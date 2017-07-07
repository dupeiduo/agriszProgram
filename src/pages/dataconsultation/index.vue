<template>
  <div class="data-consultation pr" 
      :style="{'left': menuWidth + 'px',width: screenWidth - menuWidth - 10 + 'px'}"
      :class="animationClassName"
      @click="hideTree"
      >
    
    <section class="header-section clear">
      <span class="fl header-section-title">选择地点</span>
      <div class="area-tree fl">
        <tree 
          class="fl"
          :treeData="treeData" 
          :showTree="areaShowTree"
          @getTreeNode="treeClickEvent"
          @changeShowTreeStatus="treeStatusChange"
          ></tree>
      </div>
    </section>
    
    <div class="panel-page">
        <section class="first-panel clear">
          
          <div class="map fl" :style="{width: screenWidth - menuWidth - 10 - 378  - 36 + 'px'}">
            <panel-section :panelTitle="treeName" height="380">
              <div slot="panel-detail">
                <div id="sMap" class="special-map" 
                  v-loading.lock="mapLoading"
                  :style="{width: screenWidth - menuWidth - 10 - 378  - 36 + 'px'}"></div>
              </div>
            </panel-section>
          </div>

          <div class="plant-area-info fl pr" v-loading.lock="barLoading">
            <panel-section panelTitle="种植规划分级信息" height="380" :detailBtn="{name: '详情', href:'/plant?id=3'}">
              <div slot="panel-detail">
                <plant-infor :plantBarChart="plantBarChart"></plant-infor>
                <my-echart :options="plantRingChart" class="echart-ring"></my-echart>
                <h3 class="all-area ps" v-if="plantBarChart && !barLoading">总面积</br>{{allArea}}万亩</h3>
                <expect-data :showSectionData="true" v-if="!plantBarChart&& !barLoading"></expect-data>
              </div>
            </panel-section>
          </div>
        </section>

        <section class="second-panel clear">
          
          <div class="realtime-weather fl" v-loading.lock="forecastLoading">
            <panel-section panelTitle="实时天气" height="317" :detailBtn="{name: '详情', href:'/weather'}">
              <div slot="panel-detail">
                <realtime-weather 
                  :weatherInfo="weatherInfo" 
                  :lonlat="lonlat"
                  ></realtime-weather>
              </div>
            </panel-section>
          </div>

          <div class="weather-average fl" :style="{width: screenWidth - menuWidth - 10 - 335  - 36 + 'px'}">
            <panel-section panelTitle="气象数据" height="317" :detailBtn="{name: '详情', href:'/weather'}">
              <div slot="panel-detail">
                <weather-data @chageChart="chageChart">
                  <my-echart
                    v-loading.lock="weatherAnLoading"
                    slot="echart" 
                    :options="weOptions" 
                    :style="{width: screenWidth - menuWidth - 10 - 335  - 35 + 'px',height:'217px'}"></my-echart>
                    <expect-data
                      slot="echart" 
                      :showSectionData="true" 
                      v-if="(!weOptions) && (!weatherAnLoading)">
                </expect-data>
                </weather-data>
              </div>
            </panel-section>
          </div>

        </section>

        <section class="third-panel clear">
          
          <div class="growth fl pr" :style="{width: (screenWidth - menuWidth - 10  - 36)/2 + 'px'}" >
            <panel-section panelTitle="作物长势" :detailBtn="{name: '详情', href:'/monitor?id=0'}" height="449">
              <div slot="panel-detail" class="growth-container pr" v-loading.lock="growthLoading">

                <div class="growth-title clear" v-if="growthChartData">
                  <span class="growth-area fl">{{treeNodeName}}</span>
                  <span class="growth-status fr">{{growthDesc.name}}</span>
                  <span class="growth-num fr">{{growthDesc.percent * 100}}%</span>
                </div>
                <div v-if="growthChartData">
                  <div
                    class="growth-switch-btn ps" 
                    v-if="!switchStatus" 
                    @click="toggleChartType" >
                    <i class="iconfont icon-zhuzhuangtu" style="font-size:12px"></i>
                    <span>折线图</span>
                  </div>
                  <div v-else class="growth-switch-btn ps" @click="toggleChartType">
                    <i class="iconfont icon-iconfontcolor58" style="font-size:12px"></i>
                    <span>柱状图</span>
                  </div>
                </div>

                <div class="growth-echart-container"
                :style="{width: (screenWidth - menuWidth - 10  - 36)/2 - 24 + 'px'}"
                 >
                  <my-echart
                    v-if="growthChartData"  
                    class="growth-echart"
                    :style="{width: (screenWidth - menuWidth - 10  - 36)/2 - 24 + 'px'}"
                    :height="'190px'"
                    :options="growthChartData">
                  </my-echart>
                </div>
                <expect-data :showSectionData="true" v-if="!growthChartData && !growthLoading">
                </expect-data>
              </div>
            </panel-section>
          </div>

          <div class="drougt fl pr" :style="{width: (screenWidth - menuWidth - 10  - 36)/2 + 'px'}">
            <panel-section panelTitle="作物旱情" height="449" :detailBtn="{name: '详情', href:'/monitor?id=0'}">
              <div slot="panel-detail" class="drougt-container pr" v-loading.lock="drougtLoading">
                <div class="drougt-title clear" v-if="drougtChartData">
                  <span class="drougt-area fl">{{treeNodeName}}</span>
                  <span class="drougt-status fr">{{droughtDesc.name}}</span>
                  <span class="drougt-num fr">{{droughtDesc.percent * 100}}%</span>
                </div>

                <div 
                  class="drougt-echart-container pr"
                  v-if="drougtChartData"
                  :style="{width: (screenWidth - menuWidth - 10  - 36)/2 - 24 + 'px'}">
                  <my-echart  
                    class="drougt-echart"
                    :style="{width: (screenWidth - menuWidth - 10  - 36)/2 - 24 + 'px'}"
                    :height="'240px'"
                    :options="drougtChartData">
                  </my-echart>
                </div>
                <expect-data :showSectionData="true" v-if="!drougtChartData && !drougtLoading"></expect-data>
              </div>
              
            </panel-section>
          </div>
        </section>

        <section class="fourth-panel clear">
          
          <div class="classify-area fl">
            <panel-section panelTitle="作物分布信息" height="270" :detailBtn="{name: '详情', href:'/classify?id=4'}">
              <div slot="panel-detail" class="pr">
                <div class="classify-information clear" v-loading.lock="cpPieLoading">
                  <ul class="information-list fl" :style="{width: screenWidth - menuWidth - 10  - 36 - 521 -14 + 'px'}">
                    <li class="clear"  v-for="(item,index) in cropInfo" :class="'crop'+item.id" :style="{width: (screenWidth - menuWidth - 10  - 28 - 36 - 521)/2 + 'px'}">
                      <i class="iconfont fl" :class="item.icon"></i>
                      <div class="fl information-crop">
                         <h3>{{item.name}}</h3>
                         <p>
                           <b>{{item.value * 15 / 10000/ 10000 | toFixedTwo}}</b> 万亩
                         </p>
                      </div>
                    </li>
                  </ul>
                  <div class="classify-echart fl" >
                    <my-echart
                      :options="cpPieChart" 
                      class="echart"></my-echart>
                  </div>
                </div>
                <expect-data :showSectionData="true" v-if="cropInfo.length === 0 && !cpPieLoading && !cpPieChart"></expect-data>
              </div>
            </panel-section>
          </div>

          <div class="report-type fl">
            <panel-section panelTitle="农情报告" height="270" :detailBtn="{name: '详情', href:'/report?id=1'}">
              <div slot="panel-detail" class="pr" v-loading.lock="reportLoading" style="height: 226px">
                <ul v-if="reportType.length > 0">
                  <li class="pr" v-for="item in reportType">
                    <div class="report-left"><i class="iconfont icon-NOTEPAD"></i>{{item.topic_name}}</div>
                    <span class="ps number">{{item.total}}份</span>
                    </li>
                </ul>
                <expect-data v-else-if="reportType.length == 0 && !reportLoading" 
                    :showSectionData="true"></expect-data>
              </div>
            </panel-section>
          </div>
        </section>
    </div>
  </div>
</template>

<script>

import request from 'api/request.js'
import model from 'api/model.js'
import {dateUtil, formatData} from 'plugins/utils.js'
import config from 'config/env/config.env.js'
import configData from '../../config/data.js'
import echart from './echart/index.js'


import tree from 'components/tree'
import panelSection from './panel/index.vue'
import {mapGetters} from 'vuex'
import tempConfig from './config/index.js'
import forcastCtl from 'agrisz-weather/echart.js'
import weatherChartCtl from '../weather/echart/index.js'
import monitorChartCtl from '../monitor/echart/index.js'
import cpChartCtl from '../classify/echart/index.js'
import realtimeWeather from './weather/index.vue'
import weatherData from './weatherdata/index.vue'
import plantInfor from './plant/index.vue'
import expectData from 'components/expectData/'
import datChartCtl from './echart/index.js'
import {elementUtil} from 'plugins/utils.js'


export default {
  data() {
    return {
      map: null,
      selectedLayer: null,
      mapLoading: false,
      cropInfo: [],
      treeData: [],
      treeNodeName:'',
      treeName: '',
      code: null,
      bounds: [],
      areaShowTree: false,
      animationClassName: '',
      rootCode: '',
      rootName: "",

      barLoading: true,
      areaStatsCache: {},
      surId: '',
      elementId: '',

      plantBarChart: null,
      plantRingChart: {},
      allArea: 0,

      forecastLoading: true,
      temperature: '',
      rain: '',
      humidity: '',
      windContent: '',
      realtimeSkycon: '',
      realtimeColor: '',
      realtimeIcon: '',
      rainLevel: '',
      forecastContentBefore: '',
      forecastContentAfter: '',
      forecastIcon: '',

      weatherAnLoading: true,
      selectedItem: tempConfig.weatherMenu[0],
      START_YEAR: new Date().getFullYear(),
      START_TENDAY: "01",
      END_TENDAY: dateUtil.dateToPeriod(new Date()),
      weOptions: null,

      drougtLoading: false,
      growthLoading: false,
      growthChartData: null,
      drougtChartData: null,
      droughtDesc: {},
      growthDesc: {},
      weatherInfo: {temperature : 20},
      lonlat: [],

      reportLoading: true,
      reportType: [],

      switchStatus:false,

      cpPieChart: null,
      cpPieLoading: false,
      chartOption: {},
      topicId: '',
      showSectionData: false,

      dataZoom: {start: 0.1, end: 100},

    }
  },
  mounted() {
    this.initAreaTree()
    this.fetchCpList()
    this.getReportType()
    this.drougtLoading = true
    this.growthLoading = true
    this.changeLoadOpacity("rgba(255,255,255,1)")
  },
  computed: {
    ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
    })},
  methods: {
    hideTree(){
      this.areaShowTree = false
    },
    toggleChartType(){
      this.switchStatus = !this.switchStatus
      this.switchGrowChart(this.switchStatus)
    },
    initAreaTree() {
      tempConfig.fetchRootCode().then((response)=> {
        this.rootCode = response.data

        this.initPlant()
        
        this.fetchAreaTree(this.rootCode)
      })
    },
    initMap(bounds) {
      var center = this.getLonlatByBounds(bounds)
      var bounds = model.formatBounds({bounds})
      this.map = new ol.Map({
        target: "sMap",
        interactions : ol.interaction.defaults({
          doubleClickZoom :false, 
          mouseWheelZoom: false,
          dragPan: false
        }),
        view: new ol.View({
          center: ol.proj.fromLonLat(center),
          zoom: 9
        }),
        layers: [this.getBaseLayer()]
      });

      this.highlightLayer(this.code)
      this.mapLoading = false
    },
    getBaseLayer() {
      var server = config.mapUrl;
      var layerName = "map:sz_gov_shape_data";
      var sldName = "map:dahua_datav_sld"

      var extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
      var layer = new ol.layer.Image({
        extent: extent,
        source: new ol.source.ImageWMS({
          url : server,
          params: {
            'VERSION': '1.1.1',
            'LAYERS': layerName,
            "tiled": true,
            "STYLES": sldName
          }
        })
      });
      layer.setZIndex(8)

      return layer
    },
    highlightLayer(code) {
      if (this.selectedLayer) {
        this.map.removeLayer(this.selectedLayer)
        this.selectedLayer = null
      }

      this.selectedLayer = this.getLayerByCode(code)
      this.map.addLayer(this.selectedLayer)
    },
    getLayerByCode(code) {
      var server = config.mapUrl;
      var layerName = "map:sz_gov_shape_data";

      var sld = this.getSld([code], layerName)
      var layer = this.addFilteredPGLayer(server, layerName, sld)

      return layer
    },
    getSld(codes, layerName) {
      var sldLiteral = ''

      for (var i = 0; i < codes.length; i++) {
        sldLiteral += `<ogc:Literal>${codes[i]}</ogc:Literal>`
      }
      var sld = '<?xml version="1.0" encoding="ISO-8859-1"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml">  <UserLayer> <Name>' + layerName + '</Name> <UserStyle> <Title>GeoServer SLD Cook Book: Simple point</Title> <FeatureTypeStyle> <Rule> <ogc:Filter> <ogc:PropertyIsEqualTo> <ogc:Function name="in"> <ogc:PropertyName>area_code</ogc:PropertyName> ' + sldLiteral + ' </ogc:Function> <ogc:Literal>true</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter><PolygonSymbolizer><Fill> <CssParameter name="fill">#000000</CssParameter> <CssParameter name="fill-opacity">0</CssParameter></Fill><Stroke> <CssParameter name="stroke">#1665c1</CssParameter> <CssParameter name="stroke-width">1.6</CssParameter></Stroke></PolygonSymbolizer><PolygonSymbolizer><Fill> <CssParameter name="fill">#000000</CssParameter> <CssParameter name="fill-opacity">0</CssParameter></Fill><Stroke> <CssParameter name="stroke">#ffffff</CssParameter> <CssParameter name="stroke-width">0.2</CssParameter> </Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></UserLayer></StyledLayerDescriptor>'
      return sld
    },
    addFilteredPGLayer(server, layerName, sld) {
      var extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
      var layer = new ol.layer.Image({
        extent: extent,
        source: new ol.source.ImageWMS({
          url : server,
          params: {
            'VERSION': '1.1.1',
            'LAYERS': layerName,
            "tiled": true,
            "SLD_BODY": sld
          }
        })
      });
      layer.setZIndex(9)

      return layer
    },
    getCodes(node) {
      var codes = [node.area_id]
      if (node.contain) {
        for (var i = 0; i < node.contain.length; i++) {
          codes.push(node.contain[i].area_id)
        }
      }
      return codes
    },
    fetchAreaTree(code) {
      var data = { arealist: [ { "grade": '5', "area_code": code } ] }
      this.mapLoading = true
      request.getPartAreas(data).then((response) => {
        
        if (response && response.status === 200 || response.data.status === 0) {
          this.treeData = response.data.data;
          this.rootName = this.treeData[0].area_name
          this.treeClickEvent(this.treeData[0])

          this.initMap(this.treeData[0].bounds)

        } else {
          // 无政区树数据
          console.log("接口返回:" + response.data.error_msg); 
        }
      });
    },
    treeClickEvent(node) {
      this.treeNodeName = node.area_name
      this.code = node.area_id
      this.bounds = model.formatBounds(node)
      this.treeName = this.code == this.rootCode 
                    ? this.rootName
                    : this.rootName + "—" + node.area_name

      if (this.areaStatsCache[this.surId]) {
        this.setBarOption(this.code)

      } else {
        this.fetchSurId()
      }
      var lonlat = this.getLonlatByBounds(node.bounds)

      this.initWeather(lonlat)
      
      this.switchGrowChart(this.switchStatus)
      this.initBarChart(this.code, tempConfig.droughtKey)
      
      if (this.cpId) {
        this.fetchCpData(this.cpId)
      }

      if (this.map) {
        this.highlightLayer(this.code)
      }
    },
    getLonlatByBounds(bounds) {
      var center = []
      center[0] = (bounds.lb_lon + bounds.rt_lon)/2
      center[1] = (bounds.lb_lat + bounds.rt_lat)/2 

      return center
    },
    treeStatusChange(status) {
      this.areaShowTree = status
    },

    initPlant() {
      this.fetchSurId()
    },
    fetchSurId() {
      tempConfig.fetchSurId().then((response)=> {
        this.surId = response.data

        this.fetchElementId()
      })
    },
    fetchElementId() {
      tempConfig.fetchElementId().then((response)=> {
        this.elementId = response.data

        this.fetchAreaStats(this.surId, this.elementId)
      })
    },
    fetchAreaStats(id, elementId) {
      if (id && !this.areaStatsCache[id]) {
        var params = {
          sur_ids: [id]
        }
        this.barLoading = true
        request.surAreaStats(params).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            this.areaStatsCache[id] = model.formatAreaStats(response.data.data)
            var code = this.code ? this.code : this.rootCode
            this.setBarOption(this.rootCode)

          } else {
            this.areaStatsCache[id] = null
            console.log(`no surId is ${id}'s area statistics `)
          }
          this.barLoading = false
        })
      }
    },
    setBarOption(code) {
      this.plantBarChart = [].concat(this.areaStatsCache[this.surId][this.elementId][code].bar)
      this.allArea = 0
      for(var i = 0; i < this.plantBarChart.length; i++){
        var allNumber = (this.plantBarChart[i].value/10000).toFixed(2)
        this.allArea += Number(allNumber)
      }
      this.plantBarChart.reverse()
      this.getPlantRingChart()
    },
    getPlantRingChart(){
      this.plantRingChart = echart.getRing(this.plantBarChart)
    },
    initWeather(lonlat) {
      this.lonlat = lonlat
      this.fetchReatimeForecast(lonlat)
      this.initWeatherAn(lonlat)
    },
    fetchReatimeForecast(lonlat) {
      this.forecastLoading = true
      this.changeLoadOpacity("rgba(255,255,255,1)")
      request.weatherRealtime(lonlat).then((data) => {
        if(data && data.status === 200 && data.data.status === 0 && data.data.data.status === "ok") {                
          this.renderRealtimeWeather(data.data.data.result)

        } else {
          // 加载失败
        }

        this.forecastLoading = false 
      })
    },
    renderRealtimeWeather(data) {
      this.weatherInfo.temperature = data.temperature
      this.weatherInfo.pm25color = forcastCtl.getAqi(data.aqi).color
      this.weatherInfo.pm25content  = forcastCtl.getAqi(data.aqi).content
      this.weatherInfo.humidity = Number(data.humidity * 100).toFixed(0) + '%'
      this.weatherInfo.windContent = forcastCtl.getBoldWindContent(data.wind.direction, data.wind.speed
        )
      var rain = data.precipitation.local.intensity
      this.renderRainInfo(rain, data.skycon)
    },
    renderRainInfo(rain, skycon) {
      if (rain > 0.05) {
        var rainInfo = forcastCtl.getRainLevel(rain)
        
        this.weatherInfo.rainLevel = rainInfo.level
        this.weatherInfo.realtimeSkycon = rainInfo.intensity
        this.weatherInfo.realtimeIcon = rainInfo.icon
        this.weatherInfo.realtimeColor = rainInfo.color

        this.weatherInfo.forecastContentBefore = "正在下雨"
        this.weatherInfo.forecastContentAfter = ""
        this.weatherInfo.forecastIcon = rainInfo.icon

      } else {
        forcastCtl.setCurrentSkycon(skycon)
        this.weatherInfo.rainLevel = 0
        this.weatherInfo.realtimeSkycon = forcastCtl.getSkyconZh()
        this.weatherInfo.realtimeIcon = forcastCtl.getSkyconIcon()
        this.weatherInfo.realtimeColor = forcastCtl.getSkyconColor()
      }
    },

    initWeatherAn(lonlat) {
      this.fetchDayChartData(lonlat)
    },
    fetchDayChartData(lonlat) {
      var options = {
        startYear: this.START_YEAR,
        startTenday: this.START_TENDAY,
        endYear: this.START_YEAR,
        endTenday: this.END_TENDAY,
        lon: lonlat[0],
        lat: lonlat[1],
        name: this.selectedItem.key
      }
      this.weatherAnLoading = true

      request.atmosAtPoint(options).then((response)=> {
        if (response && response.status === 200 && response.data.status === 0) {
          
          var formated = this.formatApiData(response.data.data)
          this.setChartOptions(formated)
        } else {
          console.log("获取数据出错" + response.data.error_msg)
        }
        this.weatherAnLoading = false
      })
    },
    formatApiData(data) {
      var date = dateUtil.periodToDate(`${this.START_YEAR}${this.START_TENDAY}`)
      
      if (this.selectedItem.date_tag == "tenday") {
        var options = {
          startDate: date,
          endDate: new Date(),
          ENCN: true,
          data: data,
          toFixed: 2
        };
        var formated = formatData.apiDataToPeriod(options);
        
      } else {
        options = {
          startDate: date,
          endDate: new Date(),
          data: data,
          toFixed: 2
        };
        var formated = formatData.apiDataToDay(options)
      }
      
      return formated
    },
    setChartOptions(data) {
      switch(this.selectedItem.styles) {
        case "atmos_tem":
          this.weOptions = echart.getTemChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
          break
        case "atmos_pre_acc":
          this.weOptions = echart.getRainChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
          break
        case "atmos_pre_an":
          this.weOptions = echart.getRainAverageChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
          break
        case "atmos_pre_anp":
          this.weOptions = echart.getRainAverageChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
          break
        case "atmos_tem_acc":
          this.weOptions = echart.getTemAverageChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
          break
        default:
          this.weOptions = echart.getRainAverageChart(data.X, data.Y, this.selectedItem.name, this.dataZoom)
          break
      }
    },
    chageChart(topicId){
      this.selectedItem = topicId
      this.fetchDayChartData(this.lonlat)
    },
    switchGrowChart(isLineChart) {
      if (isLineChart) {
        this.initGrwothChart(this.code)
      
      } else {
        var key = tempConfig.growthKey
        this.initBarChart(this.code, key)
      }
    },
    initGrwothChart(code) {
      var key = tempConfig.growthKey
      var params = this.getGrowthChartParams(key, code)
      this.growthChart(params);
    },
    getGrowthChartParams(key, code) {
      var end = (new Date()).getFullYear().toString(),
        url = `${key}/${code}/${end}/9`,
        startDate = new Date(`${(end - 9)}-01-01`)
      
      var params = {
        url: url,
        startDate: startDate,
        endDate: new Date()
      }

      return params
    },
    growthChart(options) {
      this.growthLoading = true
      request.lineData(options).then((response) => {
        response = response.data;
        if (response && response.status == '0') {
          var formated = model.formatMonitorLine(response, options);
          this.growthChartData = datChartCtl.getGrowthLine(formated);
        } else {
          // 无长势图数据
          this.growthChartData = null
        }
        this.growthLoading = false
      });
    },
    initBarChart(code, key) {
      var params = this.getDroughtChartParams(key, code)
      if (key === "TCI") {
        this.drougtChart(params);

      } else {
        params.url = params.url.replace("NDVI", "NDVI-1")
        this.growthBarChart(params);
      }
      
    },
    getDroughtChartParams(key, code) {
      var end = dateUtil.formatDate(new Date()),
        startDate = new Date('2010-01-01'),
        startStr = dateUtil.formatDate(startDate),
        url =  `${key}/${code}/${startStr}/${end}`
      
      var legend =  configData.productLegendConf[key]
      
      var params = {
        url: url,
        legend: legend,
        startDate: startDate,
        endDate: new Date()
      }

      return params
    },
    drougtChart(params) {
      this.drougtLoading = true
      request.barData(params).then((response) => {
        response = response.data;
        if (response && response.status == '0') {
          var formated = model.formatMonitorBar(response, params);
          this.setDroughtDesc(formated, response.data)

          this.drougtChartData = datChartCtl.getGrowthBar(formated);
        
        } else {
          this.drougtChartData = null
        }
        this.drougtLoading = false
      });
    },
    fetchExistDrought(key, code, startYear, endYear, callback) {
      request.existProduct(key, code, startYear, endYear).then((response)=> {
        if (response && response.status === 200 && response.data.status === 0) {
          var option = {
            startDate: new Date(startYear + "-01-01"),
            endDate: new Date(),
            data: response.data.data,
            ENCN: true
          };
          var _data = formatData.apiDataToPeriod(option);
          callback(_data)
        } 
      })
    },
    setDroughtDesc(formated, data) {
      var key = tempConfig.droughtKey
      var startYear = 2010 
      var endYear = new Date().getFullYear()

      this.drDescLoading = true
      this.fetchExistDrought(key, this.code, startYear, endYear, (result)=> {
        for (var i = result.Y.length - 1; i >= 0; i--) {
          if (result.Y[i] === 1) {

            var max = -Infinity, total = 0 
            var percent = "", name = ""

            for(var key = 1; key <6; key ++) {
              var value = Number(formated["data"+key][i])
              if (max < value) {
                max = value
                name = formated.legend[key].name
              }
              if (!isNaN(value)) {
                total+= value
              }
            } 
            
            percent = Number(max / total).toFixed(2)
            
            this.droughtDesc = {max, name, percent, total}

            break
          }
        }
        this.drDescLoading = false
      })
    },
    growthBarChart(params) {
      this.growthLoading = true
      request.barData(params).then((response) => {
        response = response.data;
        if (response && response.status == '0') {
          var formated = model.formatMonitorBar(response, params);
          this.setGrowthDesc(formated)
          this.growthChartData = datChartCtl.getGrowthBar(formated);
        } else {
          this.growthChartData = null
        }
        this.growthLoading = false
      });
    },
    setGrowthDesc(formated) {

      var key = tempConfig.growthKey + '-1'
      var startYear = 2010 
      var endYear = new Date().getFullYear()

      this.drDescLoading = true
      this.fetchExistDrought(key, this.code, startYear, endYear, (result)=> {
        for (var i = result.Y.length - 1; i >= 0; i--) {
          if (result.Y[i] === 1) {

            var max = -Infinity, total = 0 
            var percent = "", name = ""

            for(var key = 1; key <6; key ++) {
              var value = Number(formated["data"+key][i])
              if (max < value) {
                max = value
                name = formated.legend[key].name
              }
              if (!isNaN(value)) {
                total+= value
              }
            } 
            
            percent = Number(max / total).toFixed(2)
            
            this.growthDesc = {max, name, percent, total}

            break
          }
        }
        
        this.drDescLoading = false
      })
    },

    fetchCpList() {
      this.classifyLoading = true

      request.distributeList().then((response) => {
        if (response && response.status === 200 && response.data.status === 200) {
          var list = model.formatCps(response.data.data)
          if (list && list.length > 0) {
            this.cpId = list[0].only_result
            this.fetchCpData(this.cpId)
          }
        } else {
          // 无分布数据
          console.log("该用户无分布数据")
        }
        this.classifyLoading = false
      })
    },
    fetchCpData(cpId) {
      var code = this.code ? this.code : this.rootCode
      this.cpPieLoading = true
      request.distributeById(cpId).then((response) => {
        if (response.status !== 200 || response.data.status !== 0) {
          this.cpPieChart = null
          this.cpPieLoading = false
          // no classify data
          
        } else {
          var formated = model.formatCpData(response.data.data[cpId], this.code)
          if (!formated) {
            // no classify data
            this.cpPieChart = null
            this.cpPieLoading = false
          } else {
            this.setCpPieChart(cpId, formated.cp)
          }
        }
        this.cpPieLoading = false
      })
    },
    setCpPieChart(id, cp) {
      var chartData = this.getPieData(cp, id)
      this.cropInfo = chartData.cropInfo;
      
      this.cpPieChart = echart.getPie(chartData.pieData, "", 60, true);
    },
    getPieData (data, id) {
      var colors = configData.sld.cfLayerColors
      var pieData = [];
      var crops = data.crops;
      var cropInfo = []
      for (var i = 0; i < crops.length; i++) {
        var dataItem = {
          name: crops[i].name, 
          value: crops[i].a,
          id: crops[i].id,
          itemStyle: {
            normal: {
              color: colors[i],
            }
          }
        }
        var cropItem = {
          name: crops[i].name, 
          value: crops[i].a,
          color: colors[i],
          icon: 'icon-crop-'+ crops[i].id,
          id: crops[i].id
        }
        cropInfo.push(cropItem)
        pieData.push(dataItem);
      }

      return {pieData, cropInfo}
    },
    getReportType() {
      this.reportLoading = true
      request.reportType().then((response)=> {
        if (response && response.status === 200 && response.data.status === 200) {
          this.reportType = response.data.data
          
        } else {
          // 无报告专题数据
          this.reportType = []
        }
        this.reportLoading = false
      })
    },
    changeLoadOpacity(color) {
      setTimeout(()=> {
        var dom = document.getElementsByClassName('el-loading-mask')
        elementUtil.setDomStyle(dom, 'backgroundColor', color)
      })
    }
  },
  filters: {
    toFixedTwo(value) {
      return value.toFixed(2)
    },
  },
  watch: {
    menuWidth(width){
        if(width) {
          this.animationClassName = 'menu-left-animation'
        }
    },
    screenWidth(change){
      if(change) {
        this.switchGrowChart(this.switchStatus)
        this.initBarChart(this.code, tempConfig.droughtKey)
        this.initWeatherAn(this.lonlat)
      }
    }
  },
  components: {
    tree,
    panelSection,
    realtimeWeather,
    weatherData,
    expectData,
    plantInfor
  }
}
</script>
<style 
   lang="less"
   rel="stylesheet/less"
   scoped>
@import '../../assets/style/common';
@import '../../assets/style/reset';
.crop117 {
  background: #faedf2;
  i {
    background: #66052d;
  }
}
.crop121 {
  background: #f2fcdd;
  i {
    background: #86c118;
  }
}
.crop201 {
  background: #f0e9da;
  i {
    background: #896320;
  }
}
.crop240{
  background: #fce6d4;
  i {
    background: #E86C07;
  }
}
.crop135 {
  background: #f2fcdd;
  i {
    background: #87bf19;
  }
}
.crop134{
  background: #fdf7d0;
  i {
    background: #f2cd14;
  }
}
.crop230{
  background: #f8e4ff;
  i {
    background: #550079;
  }
}
.crop220{
  background: #f4ecff;
  i {
    background: #884cf6;
  }
}
.data-consultation {
  top: 48px;
  background: #e3e4e1;
  overflow: hidden;
  .header-section {
    padding: 10px 0 0 24px;
    height: 48px;
    background: #d9ecff;
    border-bottom: 1px solid #c9c9c9;
    .header-section-title {
      font-size: 14px;
      line-height: 34px;
      margin-right: 14px;
    }
    .area-tree {
      width: 180px;
    }
  }
  .panel-page {
    margin: 8px 12px 0;
    padding-bottom: 20px;
    .first-panel {
      .map {
        width: 480px;
        position: static;
        margin-right: 12px;

        .special-map {
          height: 330px;
        }
      }
      .plant-area-info {
        width: 378px;
        .all-area {
          width: 92px;
          left: 144px;
          top: 222px;
          font-size: 16px;
          text-align: center;
        }
        .echart-ring {
          width: 378px;
          height: 200px;
          margin-top: 20px;
        }
      }
    }
    .second-panel {
      margin-top: 10px;
      .realtime-weather {
        width: 335px;
        margin-right: 12px;
      }
      .weather-average {
        width: 521px;
      }
    }
    .third-panel {
      margin-top: 10px;
      .growth {
        width: 426px;
        margin-right: 12px;
        .growth-container {
          padding: 12px 12px 10px;
          .growth-title {
            .adv-height(48px);
            padding: 0 12px;
            box-sizing: border-box;
            background: #dcf3f1;
            .growth-area {
              .adv-font-big();
            }
            .growth-num {
              font-size: 24px;
            }
            .growth-status {
              font-size: 14px;
              margin: 4px 16px 0 12px;
            }
          }
          .growth-switch-btn {
            .adv-normal-primary-btn();
            top: 68px;
            right: 12px;
          }
          .growth-echart-container{
            margin-top: 35px;
            height: 310px;
            .growth-echart {
              width: 355px;
              height: 310px;
            }
          }
        }
      }
      .drougt {
        width: 427px;
        .drougt-container {
          height: 330px;
          padding: 12px 12px 10px;
          .drougt-title {
            .adv-height(48px);
            padding: 0 12px;
            box-sizing: border-box;
            background: #fbf4b8;
            .drougt-area {
              .adv-font-big();
            }
            .drougt-num {
              font-size: 24px;
            }
            .drougt-status {
              font-size: 14px;
              margin: 4px 16px 0 12px;
            }
          }
          .drougt-echart-container{
            margin-top: 15px;
            height: 330px;
            .drougt-echart {
              width: 355px;
              height: 330px;
            }
          }
        }
    

      }
    }
    .fourth-panel {
      margin-top: 10px;
      .classify-echart {
        width: 262px;
        height: 227px;
        border-left: 1px solid #dcdcdc;
        .echart {
           width: 262px;
           height: 227px;
        }
      }
      .classify-area {
        margin-right: 12px;
        .information-list {
          width: 365px;
          padding: 14px;
          overflow: hidden;
          li {
            float: left;
            padding: 8px 0;
            margin-right: 14px;
            border-radius: 4px;
            margin-bottom: 14px;
            &:nth-child(2n) {
              margin-right: 0px;
            }
            i {
              display: inline-block;
              border-radius: 50%;
              color: #fff;
              margin-left: 12px;
              .mixin-width(40px);
              .mixin-height(40px);
            }
            .information-crop {
              margin-left: 12px;
              b {
                font-size: 18px;
              }
            }
          }
        }
      }
      .report-type {
        width: 228px;
        ul {
          height: 228px;
          overflow: auto;
        }
        li {
          margin: 8px 14px 0;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 8px;
          .report-left {
            font-size: 16px;
            i {
              display: inline-block;
              border-radius: 4px;
              background: #e9f9cb;
              color: #7ba23c;
              margin-right: 16px;
              .mixin-width(40px);
              .mixin-height(40px);
            }
          }
          .number {
            top: 10px;
            right: 10px;
          }
        }
      }
    }
  }
}
</style>