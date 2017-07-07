<template>
  <div @click="hideTree">
    <v-legend v-if="showLegend" :legendData="legends"></v-legend>
    <my-map class="map monitor-map" 
      @initMap="initMap" 
      background="#fff"
      :top="97"
      borderRadius="4px"
      :switchCtl="true"
      :centerCtl="{use: true, bounds: bounds}"
      :maxZoom="12" ref="map"
      :useTools="true"></my-map>
    <div class="m-left-tab">
      <left-tab 
        class="m-lefttab"
        :showList="showList"
        @toggleList="toggleListStatus"
        :leftTab="[]"
        :title="'产品列表'"
        listTitle="返回查看所有监测产品"
        :backList="backList"
        @changeState="switchList"

        >

        <v-list slot="list" 
          :list="list" 
          :curIndex="curIndex"
          :listHeight="(showWeather ? getScreenHeight - 300 : getScreenHeight - 285)"
          @listChange="changeIndex">
        </v-list>

        <div slot="detail" v-loading.lock="leftLoading">
          <div class="crop-test">
            <div class="clear">
              <h3 class="crop-test-titile fl">{{listTitle}}</h3>
              <div @click.stop="hideTree" class="pr">
                   <el-tooltip class="item" effect="dark" content="上一期" placement="top">
                     <i class="phase pre-period el-icon-arrow-left ps" @click="jumpPeriod(-1)"></i>
                   </el-tooltip>
                  <v-time @click.native="stopEvent"
                    :curDate="curDate" 
                    :showPop="showTime"
                    :startDate="new Date('2010-01-01')"
                    @showPanel="showTime = true"
                    @changeDate="changeDate"></v-time>
                    <el-tooltip class="item" effect="dark" content="下一期" placement="top">
                      <i class="phase next-period el-icon-arrow-right ps" @click="jumpPeriod(1)"></i>
                    </el-tooltip>
              </div>
            </div>

            <p class="crop-introduce">{{misc}}</p>
          </div>

          <div class="detail-height" :style="{height: getScreenHeight <= 794 ? (showWeather ? getScreenHeight - 400 + 'px': getScreenHeight - 380 + 'px') : '410px'}">
            <div>
              <div class="tree-bg" @click.stop="hideTree" >

                <div class="area-tree">
                  <tree 
                    :treeData="treeData" 
                    :showTree="areaShowTree"
                    @getTreeNode="getTreeNode"
                    @changeShowTreeStatus="getAreaShowTreeStatus"
                    ></tree>
                </div>
                <div class="sub-area-tree">
                  <tree 
                    :treeData="filterTree" 
                    :showTree="subShowTree"
                    @getTreeNode="getFilterTreeNode" 
                    @changeShowTreeStatus="getSubShowTreeStatus"
                    ></tree>
                </div>

                <template v-if="isGrow">
                  <el-radio-group v-model="yearLabel"  @change="changeYear">
                    <el-radio :disabled="noLayer" class="radio" label="1" v-model="yearLabel"
                   >近一年</el-radio>
                    <el-radio :disabled="noLayer" class="radio" label="5" v-model="yearLabel" 
                    >近五年</el-radio>
                  </el-radio-group>
                </template>

                <div class="block slider-container pr classify-slider clear">
                  <opacity-ctl 
                    :useable="noLayer"
                    :opacity="opacity"
                    @changeOpacity="changeOpacity"
                    :title="opactlTitle">
                  </opacity-ctl>
                </div>
              </div>
              <div class="check-data-container">
                <div class="check-data">
                  <h3 class="check-data-title">数据查看</h3>
                  <p class="check-data-section">通过对数据不同方面的查看，来更加深入的了解{{isGrow ? '作物长势' : '旱情'}}的综合情况。</p>
                </div>

                <div class="m-select-list">
                  <ul>
                    <li v-if="isGrow" class="clear">
                      <img src="static/assets/img/monitor/line.png">
                      <div class="m-list-right">
                        <p class="list-chart">
                          <span class="list-chart-title">作物长势变化图</span>
                          <span :disabled="noLayer" class="popupctl-btn"
                            @click="echartVisible = true, chartType='line'">查看折线图</span>
                        </p>
                        <p class="list-section" v-limitLine>{{lineSection}}
                        </p>
                      </div>
                    </li>
                    <li>
                      <img src="static/assets/img/monitor/bar.png">
                      <div class="m-list-right">
                        <p class="list-chart">
                          <span class="list-chart-title">{{isGrow ? '作物长势' : '旱情'}}分级统计图</span>
                          <span :disabled="noLayer" class="popupctl-btn"
                            @click="echartVisible = true, chartType='bar'">查看柱状图</span>
                        </p>
                        <p class="list-section" v-limitLine>{{barSection}}
                        </p>
                      </div>
                    </li>
                    <li>
                      <img src="static/assets/img/monitor/report.png">
                      <div class="m-list-right">
                        <p class="list-chart">
                          <span class="list-chart-title">{{reportSection}}</span>
                          <span class="popupctl-btn" @click="loadReport">查看报告</span>
                        </p>
                        <p class="list-section" v-limitLine>{{listSection}}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </left-tab>
    </div>
      
    <my-dialog v-show="echartVisible"
      @close="echartVisible = false">

      <div class="chart-title" slot="title">
        <p class="chart-title-p no-select">
          {{chartTitle}}
          <el-tooltip effect="light" :content="chartTip" placement="right-start" popper-class="tips-popover">
            <span class="help"><i class="chart-tip no-select">?</i></span>
          </el-tooltip>
        </p>
        <div class="chart-area-tree fr">
          <tree 
            :treeData="chartTreeData" 
            :showTree="chartShowTree"
            :nodeName="currentArea"
            @getTreeNode="getChartTreeNode" 
            @changeShowTreeStatus="getChartShowTreeStatus">
          </tree>
        </div>
      </div>
       <div slot="content" class="pop-echart" v-loading.lock="chartLoading">
         <my-echart  
          class="echart"
          v-if="echartData" 
          :options="echartData" 
          :width="'600px'" 
          :height="'36px'"></my-echart>
        <div v-else-if="(!chartLoading) && (!echartData)" class="we-expect-data ps">
          <i class="iconfont icon-iconfontgantanhao"></i>
          <h3 class="none-place-data">{{currentArea}}暂无{{chartTitle}}数据</h3>
          <h4 class="other-data">请选择其他区域进行查看</h4>
        </div>
       </div>
    </my-dialog>
    
    <template>
      <div v-if="showWeather" class="time-axis pf" @click="showWeather = false">收起</div>
      <div class="date-selector no-select" v-loading.lock="dlLoading">
        <date-selector
          v-if="list.length > 0"
          :style="{width: timelineWidth + 'px'}"
          :start="startDate"
          :end="new Date()"
          :date="curDate"
          :dlData="dlData"
          :forecastLoading="forecastLoading"
          :atmosLoading="atmosLoading"
          :showWeather="showWeather"
          @currentYearChange="fetchPreYearAtoms"
          @changeDate="changeDate">
      </date-selector>
      </div>
    </template>
      
    <viewreport :showReport="showReport" @closePopReport="showReport = false" class="dialog-bg" :showReportTitle="true" :reportTitle="reportTitle">
        <reportlist 
            slot="reportList"
            :reportContent="reportContent" 
            @scrollToBottom="scrollToBottom"
            :styleCtl="styleCtl"
            :clientH="clientH"
            class="monitor-report"
            >
       </reportlist>
    </viewreport>

    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
    
    <expect-data
      v-if="noMapData" 
      :showPageData="true"
      >
    </expect-data>

    <template>
      <div>
        <div v-show="!showPopDetail" id="regionBreifPopup" class="pop-fixed-width-container">
          <div class="pop-main">
            <h3 class="pop-title">{{popupTitle}}</h3>
            <p v-limitLine class="pop-content">{{popupDesc}}</p>
          </div>
          <div class="view-all-report">
            <i class="iconfont icon-iconfontgantanhao view-all-report-icon"></i>
            <span class="view-all-report-content">点击受灾区域查看完整报告</span>
          </div>  
        </div>
      </div>
      
      <div>
        <div v-show="showPopDetail" id="regionDetailPopup" class="pop-view-content-container" 
          :style="{top: -detailTop+'px', left: -detailLeft+'px'}">
          <div class="close-btn el-icon-close ps" @click="showPopDetail = false"></div>
          <div class="pop-main">
            <h3 class="pop-title">{{popupTitle}}</h3>
            <p class="pop-content">{{popupDesc}}</p>
          </div>
          <div class="view-weather">
            <span class="view-weather-btn" @click="initWeather">查看天气数据</span>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
  import axios from 'axios'
  import vLegend from './legend/index';
  import leftTab from 'components/leftTab';
  import vList from './list'
  import vTime from './time'
  import request from 'api/request.js'
  import model from 'api/model.js'
  import configData from '../../config/data.js'
  import {dateUtil} from 'plugins/utils.js'
  import {mapGetters} from 'vuex'
  import charts from './echart/index.js'
  import config from 'config/env/config.env.js'
  import dateSelector from './dateline'
  import viewreport from 'components/viewReport';
  import reportlist from 'components/reportList';
  import format from 'api/model.js';
  import drawCtl from 'agrisz-map-polygon'
  import {elementUtil} from 'plugins/utils.js'
  import tree from '../../components/tree'
  import expectData from 'components/expectData/'
  import subFilter from './subfilter'

  import modisLib from 'agrisz-lib-modis'

  var layerCtl = modisLib(config.mapUrl, config.tileMapUrl, dateUtil, configData)

  export default{
    data(){
      return {
        map: null,
        leftLoading: false,
        firstLoad: true,
        dlLoading: false,
        chartLoading: false,
        curDate: new Date(),
        legends:[],
        legend: {},
        backList: true,
        title: "选择产品",
        misc: '',
        list: [],
        curIndex: null,
        treeData: [],
        code: null,
        bounds: [],
        isOneYear: true,
        yearLabel: "1",
        isGrow: true,
        opacity: 90,
        lineReqHan: null,
        barReqHan: null,
        echartVisible: false,
        echartData: null,
        chartType: '',
        chartTip: '',
        chartTitle: '',
        layer: null,
        startDate: new Date('2010-01-01'),
        styleCtl:'',
        reportContent:[],
        perPage: 20,
        section: null,
        currntPage: 1,
        total: -1,
        reportName: '选择长势产品',
        clientH: 400,
        dlData: (function () {
          return {index: 0, data: [{hasData: false, date:'2010-01-01',period: "一月上旬"}]}
        })(),
        showList: true,
        noLayer: false,
        popTitle: '',
        opactlTitle: '长势图层透明度',
        showReport: false,
        listTitle:'',
        listSection: '',
        reportSection: '',
        lineSection: '',
        barSection: '',
        reportTitle: '',
        showTime: false,
        showLegend: true,

        timelineWidth: 0,
        showPageData: false,
        showSectionData: false,
        noMapData: false,
        currentTreeNode: null,
        currentChartTreeNode: null,
        filterTree: [],
        filteredCodes: [],
        filteredNodeName: '',
        chartTreeData: [],
        importantCodes: [],
        currentArea: '',
        chartCode: '',

        START_YEAR: 2010,
        END_YEAR: new Date().getFullYear(),

        producLayers: [],

        subShowTree:false,
        areaShowTree:false,
        chartShowTree:false,

        showWeather: false,

        regionId: '',
        popupTitle: '',
        popupDesc: '',
        detailTop: 200,
        detailLeft: 132,
        showPopDetail: false,
        weatherCache: {},

        forecastLoading: false,
        atmosLoading: false,
        atmosCache: {},
      }
  },
  mounted() {
    this.initRequest()
    this.timelineWidth = this.screenWidth - this.menuWidth - 20
  },
  methods: {
    getAreaShowTreeStatus(status){
      this.areaShowTree = status
    },
    getSubShowTreeStatus(status){
      this.subShowTree = status
    },
    getChartShowTreeStatus(status){
      this.chartShowTree = status
    },
    initRequest() {
      this.fetchAreaTree()
    },
    fetchAreaTree() {
      this.leftLoading = true
      this.dlLoading = true
      this.showPopMsgUnAutoHide("图层加载中...")

      request.cantonTree().then((response)=> {
        if (response && response.status === 200 && response.data.status === 200) {
          this.formatTrees(response.data.data)
        }

        if (!this.treeData || this.treeData.length === 0) {
          this.noProduct()

        } else {
          this.fetchProductList()
        }
      })
    },
    fetchProductList() {
      this.showPopMsgUnAutoHide("图层加载中...")
      request.productList().then((listData)=> {
        if (listData && listData.status === 200 && listData.data.status === 200) {
          if (listData.data.data.length > 0) {
            this.list = listData.data.data;
            this.curIndex = 0
          }
        } 

        if (!this.list || this.list.length < 0) {
          this.noProduct()
        }

        this.firstLoad = false
        this.leftLoading = false
      })
    },
    noProduct() {
      this.leftLoading = false
      this.dlLoading = false
      this.list =[]
      this.backList = false

      this.setNoLayer()
      this.hidePopMsg()
    },
    setNoLayer() {
      this.noLayer = true
      this.noMapData = true
      this.removeProductLayers()
    },
    formatTrees(data) {
      var tree = model.formatMonitorTree(data)
      var chartTree = model.formatMonitorTree(data)

      this.treeData = tree.treeData
      this.chartTreeData = chartTree.treeData
      this.defaultTreeNodeClick()
    },
    defaultTreeNodeClick() {
      if (this.list && this.list.length > 0) {
        this.getTreeNode(this.treeData[0])
      } else {
        setTimeout(()=> {
          this.defaultTreeNodeClick()
        }, 10)
      }
    },
    getTreeNode(data){
      this.currentTreeNode = data
      this.code = data.area_id;
      this.bounds = model.formatBounds(data)
      this.importantCodes = data.codes
      
      this.getFilterTree(data.grade, data.minGrade)

      this.getChartTreeNode(data)
    },
    getFilterTreeNode(data) {
      this.filteredNodeName = data.area_name
      var grade = data.value
      
      // 是否拼接当前选中的政区本身
      var codes = this.currentTreeNode[grade] 
          ? [this.currentTreeNode.area_id].concat(this.currentTreeNode[grade])
          : [this.currentTreeNode.area_id]

      this.setFilteredCodes(grade, codes)

      var areaCodes = this.filteredCodes.concat(this.currentTreeNode.area_id)
      
      this.addAreaLayers(areaCodes)
      this.tryAddLayers()
    },
    getChartTreeNode(data) {
      this.currentChartTreeNode = data
      this.currentArea = this.currentChartTreeNode.area_name
      
      this.chartCode = data.area_id
    },
    getFilterTree(grade, minGrade) {
      this.filterTree = []
      for(var g in subFilter[grade]) {
        if (g <= minGrade) {
          var item = {
            value: g,
            area_name:  subFilter[grade][g]
          }
          this.filterTree.push(item)
        }
      }
      this.getFilterTreeNode(this.filterTree[0])
    },
    changeOpacity(value) {
      this.opacity = value
      if (this.producLayers.length > 0 && typeof value ==="number") {

        for (var i = 0; i < this.producLayers.length; i++) {
          this.producLayers[i].setOpacity(value/100)
        }
      }
    },
    toggleListStatus(isShow) {
      this.showList = isShow;
    },
    showPopMsg(msg) {
      this.$refs['popMessage'].showDialog()
      this.popTitle = msg
    },
    showPopMsgUnAutoHide(msg) {
      this.$refs['popMessage'].showUnAutoHideDialog()
      this.popTitle = msg
    },
    hidePopMsg() {
      this.$refs['popMessage'].hidePopMsgImmediate()
    },
    loadReport() {
      this.reportContent = [];
      this.currntPage = 1;
      this.total = 0;
      this.getReportList(this.currntPage, this.perPage, this.section );
      this.showReport = true
    },
    getReportList(currntPage, perPage, section) {
      var formated = format.formatReports,
        params = new FormData();
      params.append('curPage', currntPage);
      params.append('perPage', perPage);
      params.append('section', section);
      
      request.sectionRepor(params).then((requestData) => {
        this.total = requestData.data.total;
        if (currntPage == 1) {
          this.reportContent = formated(requestData.data);
        } else {
          this.reportContent = this.reportContent.concat(formated(requestData.data));
        }
      })
    },
    scrollToBottom(toBottom) {
      if(toBottom){
        if (this.total && this.total <= this.perPage * this.currntPage) {
          return
        }
        this.currntPage += 1;
        this.getReportList(this.currntPage, this.perPage, this.section)
      }
    },
    initMap (map) {
      this.map = map;
      this.setDrawConfi()
    },
    setDrawConfi() {
      var breifPopup = document.getElementById('regionBreifPopup')

      drawCtl.setRefrence(this.map)
      drawCtl.openHoverTip(breifPopup, ({id, index})=> {
        if (id) {
          this.setRegionRefrence(id, index)
        }
      })
      drawCtl.openClickEvent(({id, index, coordinates, pixel})=> {
        if (id) {
          this.showRegionPopup(id, index, coordinates, pixel)
        }
      })
      this.map.renderSync()
    },
    setRegionRefrence(id, index) {
      this.regionId = id
      this.popupTitle = this.polygonGeomtries[index].title
      this.popupDesc = this.polygonGeomtries[index].desc
      this.lonlat = this.polygonGeomtries[index].lonlat
    },
    showRegionPopup(id, index, coordinates, pixel) {
      this.setRegionRefrence(id, index)
      
      this.fetchPreYearAtoms(this.currentYear)
      this.addDetailPopup(coordinates, pixel)
      // add detail popup detailPopup
    },
    addDetailPopup(coordinates, pixel) {
      var detailPopup = document.getElementById('regionDetailPopup')

      if (!this.detailOverlay) {
        this.detailOverlay = new ol.Overlay({
          element: detailPopup
        });
        this.map.addOverlay(this.detailOverlay);
      }
      this.detailOverlay.setPosition(coordinates)
      
      
      this.showPopDetail = true
      this.$nextTick(()=> {
        var offset = 50
        var direction = this.$refs.map.getDirection(detailPopup, pixel, this.showList)
        var position = this.$refs.map.getOverlayPosition(detailPopup, direction, offset)

        this.detailTop = position.top
        this.detailLeft = position.left
      })
    },
    initWeather() {
      this.showWeather = true
      this.fecthWeatherSkycon()
      this.fetchCurrentYearAtoms()
    },
    fecthWeatherSkycon() {
      if (!this.weatherCache[this.regionId]) {
        this.fetchForecastHistory(this.regionId)
      }
    },
    fetchForecastHistory(markerId) {
      this.forecastLoading = true
      request.atmosOfPeriodOnPoint(markerId).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.weatherCache[this.regionId] = {}
          this.weatherCache[this.regionId].history = response.data.data
          
          this.fetchForecast(this.lonlat)

        } else {
          // 获取该点气象数据失败
          this.forecastLoading = false
        }
      })
    },
    fetchForecast(lonlat) {
      request.weatherFifteenDays(lonlat).then((response)=> {
        if(response && response.status === 200 && response.data.status === 0 && response.data.data.status === "ok") {
          this.weatherCache[this.regionId].forecast = response.data.data.result

          var skycons = model.formatDLSkycon(this.weatherCache[this.regionId])
          // this.dlData.forecast = skycons
          var temDlData = this.appendSkyconToDl(skycons)
          
          this.dlData = ((data)=> data)(temDlData)
        }
        this.forecastLoading = false
      })
    },
    appendSkyconToDl(skycons) {
      var length = skycons.length
      var count = 0
      for (var i = this.dlData.data.length - 1; i >= 0; i--) {
        
        for (var j = 0; j < skycons.length; j++) {
          if (skycons[j][0].date == this.dlData.data[i].date) {
            // this.dlData.data[i].forecast = skycons[j]
            Vue.set(this.dlData.data[i], "forecast", skycons[j])
            count ++
            break
          }
        }
        if (count >= length) {
          break
        }
      }
      return this.dlData
    }, 
    formatSkycon(data) {
      var skycons = []
      var date = new Date()
      var currentPeriod = dateUtil.dayToPeriod(date.getDate())
      
      var dateArrary = getDateStringByPeriod(date, currentPeriod)

      var history = data.history

      appenHistorySkycon(history, dateArrary, skycons)

      var forecastSkycon = data.forecast.daily.skycon

      appendForcastSkycon(forecastSkycon, skycons)
      
      
      return splitToPeriod(skycons)

      function splitToPeriod(skycons) {
        var periodSkycons = []

        var firstDay = skycons[0].day
        if (firstDay == 1) {
          periodSkycons[0] = skycons.slice(0, 10)
          periodSkycons[1] = skycons.slice(10, 10)
          periodSkycons[2] = skycons.slice(20)

        } else if (firstDay == 11) {
          periodSkycons[0] = skycons.slice(0, 10)

          var index = getIndex(skycons)
          if (index > 0) {
            periodSkycons[1] = skycons.slice(11, 10)
            periodSkycons[2] = skycons.slice(11, index - 10)

          } else {
            periodSkycons[1] = skycons.slice(11)
          }

        } else {
          var index = getIndex(skycons)

          periodSkycons[0] = skycons.slice(0, index)
          periodSkycons[1] = skycons.slice(index, index + 10)
          periodSkycons[2] = skycons.slice(index + 10)
        }

        return periodSkycons
      }

      function getIndex(skycons) {
        var index
        for (var i = 0; i < skycons.length; i++) {
          if (skycons[i].day == 1) {
            index = i
            break
          }
        }

        return index
      }

      function appendForcastSkycon(forecastSkycon, skycons) {
        for (var i = 0; i < forecastSkycon.length; i++) {
          var item = {
            date: forecastSkycon[i].date,
            skycon: forecastSkycon[i].value,
            icon: getIcon(forecastSkycon[i].value),
            day: forecastSkycon[i].date.substr(-2)
          }
          skycons.push(item)
        }
        return skycons
      }

      function getDateStringByPeriod(date, currentPeriod) {
        var result = []
        var dateStr = dateUtil.formatDate(date)
        dateStr = dateStr.substr(0, 7)
        if (currentPeriod == 1) {
          for(var i = 1; i<= 10; i++) {
            if (i > date.getDate()) {
              break
            }
            result.push(dateStr + '-0'+i)
          }

        } else if (currentPeriod == 2) {
          for(var i = 11; i<= 20; i++) {
            if (i > date.getDate()) {
              break
            }
            result.push(dateStr + '-'+i)
          }
        } else {
          for(var i = 21; i<= 31; i++) {
            if (i > date.getDate()) {
              break
            }
            result.push(dateStr + '-'+i)
          }
        }

        return result
      } 

      function appenHistorySkycon(history, dateArrary, skycons) {
        for (var i = 0; i < dateArrary.length; i++) {
          for(var key in history) {
            var _skycon = history[key].result.skycon
            var item = {
              date: dateArrary[i],
              skycon: dateArrary[i] == key ? _skycon : '-',
              icon: dateArrary[i] == key ? getIcon(_skycon) : '-',
              day: dateArrary[i].substr(-2)
            }

            if (dateArrary[i] == key) {
              break
            }
            
          }
          skycons.push(item)
        }
      }

      function getIcon(key) {
        var skycon = [ "CLEAR_DAY", "CLEAR_NIGHT", "PARTLY_CLOUDY_DAY",
            "PARTLY_CLOUDY_NIGHT", "CLOUDY", "RAIN", "SNOW", "WIND", "FOG"]

        var skyconZhs  =["晴", "晴", "多云", "多云", "阴", "雨", "雪", "风", "雾"]
        var skyconIcons = [ "icon-tianqitubiao_qing", "icon-qingye", "icon-tianqitubiao_duoyun", 
                 "icon-wanshangtubiao_wanshangduoyun", "icon-tianqitubiao_yin", 
                 "icon-tianqitubiao_zhongyu", "icon-tianqitubiao_zhongxue", 
                 "icon-fengxiang", "icon-tianqitubiao_wu",
               ]
        var index = skycon.indexOf(key)

        return skyconIcons[index]
      }
    },
    fetchCurrentYearAtoms() {
      var period = dateUtil.dateToPeriod(new Date())
      var params = {
        startYear: this.END_YEAR,
        startTenday: 1,
        endYear: this.END_YEAR,
        endTenday: period,
        lon: this.lonlat[0],
        lat: this.lonlat[1]
      }
      this.fetchAtmosHistory(params)
    },
    fetchPreYearAtoms(year) {
      var key = this.regionId.toString() + year.toString()
      
      if (!this.atmosCache[key] && this.lonlat) {
        var params = {
          startYear: year,
          startTenday: 1,
          endYear: year,
          endTenday: 36,
          lon: this.lonlat[0],
          lat: this.lonlat[1]
        }
        this.fetchAtmosHistory(params, key)
      }
    },
    fetchAtmosHistory(params, key) {
      this.atmosLoading = true

      request.atmosSummaryOfPoint(params).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          
          var atmosHistory = model.formatBreifAtmosHistory(response.data.data, params)
          var temDlData = this.appendAtmosToDl(atmosHistory)

          this.dlData = ((data)=> data)(temDlData)
          this.atmosCache[key] = true

        } else {
          this.atmosCache[key] = false
        }
        this.atmosLoading = false
      })
    },
    appendAtmosToDl(atmosHistory) {
      var length = atmosHistory.length
      var count = 0
      for (var i = this.dlData.data.length - 1; i >= 0; i--) {
        
        for (var j = 0; j < atmosHistory.length; j++) {
          if (atmosHistory[j].date == this.dlData.data[i].date) {
            // this.dlData.data[i].atmos = atmosHistory[j].atmos
            Vue.set(this.dlData.data[i], "atmos", atmosHistory[j].atmos)
            count ++
            break
          }
        }
        if (count >= length) {
          break
        }
      }
      return this.dlData
    }, 
    setCenter() {
      this.$refs['map'].setCenter()
    },
    hideTree() {
      this.showTime = false

      this.areaShowTree = false
      this.subShowTree = false
      this.chartShowTree = false
    },
    stopEvent(event) {
      event.stopPropagation()
    },
    switchList(topicId) {
      this.backList = !this.backList; 
      if (!this.backList) {
        this.title = "选择产品"
      } else {
        this.title = this.list[this.curIndex].product_title;
      }
    },
    changeDate(date) {
      var dateStr = dateUtil.formatDate(date)
      this.curDate = new Date(dateStr)
      for (var i = this.dlData.data.length - 1; i >= 0; i--) {
        
        if (dateStr === this.dlData.data[i].date) {
          if (this.dlData.data[i].hasData) {

            this.noLayer = false
            this.noMapData = false

            var key = this.getKey()

            this.addLayers()

            this.showPopMsg(`已切换至(${dateStr})${this.listTitle}`)
          } else {
            this.setNoLayer()
          }
          break
        }
      }
    },

    jumpPeriod(step){
      var date = new Date(this.curDate);
      date = this.getPeriodDate(date, step)
      this.changeDate(date)
    },
    getPeriodDate(date, step) {
      var year = date.getFullYear()
      var period = parseInt(dateUtil.dateToPeriod(date))
      
      period = step + period
      
      var _date = this.getDateByPeriod(year, period)

      return _date
    },
    getDateByPeriod(year, period) {
      if (period > 36) {
        period = "01"
        year = year + 1

      } else if (period < 0) {
        period = "36"
        year = year - 1
      }
      var dateStr = year.toString() + period.toString()
      var date = dateUtil.periodToDate(dateStr)

      return date
    },


    getKey() {
      var key = this.list[this.curIndex].product_key
      key += this.isGrow ? (this.isOneYear ? '-1' : '-5') : ''
      return key
    },
    removeAreaLayer() {
      if (this.areaLayer) {
        this.map.removeLayer(this.areaLayer)
        this.areaLayer = null
      }
    },
    addAreaLayers(codes) {
      this.removeAreaLayer()

      this.areaLayer = this.$refs.map.getMultyAreaLayer(config.mapUrl, codes, this.bounds)
      this.map.addLayer(this.areaLayer)
    },
    setFilteredCodes(grade, codes) {
      var result = []
      var rootNode = this.currentTreeNode
      if (grade == rootNode.grade) {
        // area self
        result = [rootNode.area_id]

      } else if (rootNode[grade]) {
        // area son
        for (var i = 0; i < rootNode.contain.length; i++) {
          result.push(rootNode.contain[i].area_id)
        }

      } else if (rootNode.contain) {
        // area grandson
        for (var i = 0; i < rootNode.contain.length; i++) {
          if (rootNode.contain[i][grade]) {
            result = result.concat(rootNode.contain[i][grade])
          }
        }
      }

      this.filteredCodes = result
    },
    tryAddLayers() {
      this.removeProductLayers()
      this.showPopMsgUnAutoHide("图层加载中...")
      if (this.filteredCodes.length > 0 && this.list.length > 0) {
        this.fetchLatestLayers(this.filteredCodes)
      }
    },
    fetchLatestLayers(codes) {
      var key = this.getKey()
      var data = {
        "mask_type": "10",
        "index": key,
        "area_codes": codes
      }
      this.dlLoading = true

      request.latestModisLayer(data).then((response)=> {
        this.dlLoading = false
        var data = null
        if (response && response.status === 200 && response.data.status === 0) {
          data = response.data.data.summary
        }

        this.setCurrentDate(codes, data)
      })
    },
    setCurrentDate(codes, data) {
      if (data && data.year) {
        var currentYear = data.year;
        var currentPeriod = data.tenday;

        this.curDate = dateUtil.periodToDate(currentYear + currentPeriod);
        this.fetchExistLayers(codes)

      } else {
        this.curDate = new Date()
        this.setEmptyTimeline()
      }
    },
    fetchExistLayers(codes) {
      var data = {
        "mask_type": "10",
        "index": this.getKey(),
        "area_codes": codes,
        "start_year": this.START_YEAR,
        "end_year": this.END_YEAR
      }
      this.dlLoading = true

      request.existModisLayer(data).then((response)=> {
        if (response && response.status === 200 && response.data.status === 0) {
          this.dlData = model.formatDLData(response.data.data.summary, this.START_YEAR, this.END_YEAR)
          this.exsitDetail = response.data.data.detail

          this.modisMarkerExist()
          this.addLayers()

        } else {
          this.setEmptyTimeline()
        }
        
        this.dlLoading = false
      })
    },
    setEmptyTimeline() {
      this.noMapData = true
      this.hidePopMsg()
      this.dlData = model.formatDLData(null, this.START_YEAR, this.END_YEAR)
    },
    removeProductLayers() {
      if (this.producLayers.length !== 0) {
        for (var i = 0; i < this.producLayers.length; i++) {
          this.map.removeLayer(this.producLayers[i])
        }
        this.producLayers = []
        drawCtl.removePolygons()
      }
    },
    addLayers() {
      this.noMapData = false
      this.noLayer = false

      var layers = this.addLayersByCodes(this.filteredCodes, this.exsitDetail)
          
      if (layers.length === 0) {
        layers = this.addLayersByCodes(this.currentTreeNode.area_id, this.exsitDetail)
      }
      
      if (layers.length === 0) {
        this.noMapData = true
      }
      this.showPopMsg(`已切换至${this.currentArea}${this.filteredNodeName}`)
    },
    addLayersByCodes(codes, detail) {
      this.removeProductLayers()

      var key = this.getKey()
      var layer = null

      for (var i = 0; i < codes.length; i++) {
        var period = dateUtil.dateToPeriod(this.curDate)
        var year = this.curDate.getFullYear()
        var extent = this.getExtentByCode([this.currentTreeNode], codes[i])
        
        if (detail[codes[i]] && detail[codes[i]][year][period] === 1) {
          layer = this.addLayerByDate(key, this.curDate, codes[i], extent)
          this.producLayers.push(layer)
        }
      }
      
      return this.producLayers
    },
    getExtentByCode(tree, code) {
      var extent = []
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].area_id == code) {
          var bounds = model.formatBounds(tree[i])
          var extent = ol.extent.applyTransform(bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
          break
        }

        if (tree[i].contain) {
          extent = this.getExtentByCode(tree[i].contain, code)
          
          if (extent.length !== 0) {
            return extent
          }
        }
      }

      return extent
    },
    addLayerByDate(key, date, code, extent) {
      this.renderPolygons(key, date)
      
      var url = `${key}/${date.getFullYear()}/${key}_${date.getFullYear()}${dateUtil.dateToPeriod(date)}_FARMLANDMASK.${code}_GRADE`
      url = config.tileMapUrl + url
      
      var layer = this.$refs['map'].addXYZLayer(url, extent, this.map)
      layer.setOpacity(this.opacity/100)
      
      return layer
    },
    modisMarkerExist() {
      if (this.code && this.list.length > 0) {
        var key = this.getKey()
        var params = {
          type: 10,
          index: key,
          code: this.code,
          start: this.START_YEAR,
          end: this.END_YEAR,
          status: 1
        }
        request.modisMarkerExist(params).then((response)=> {
          if (response && response.status === 200 && response.data.status === 0) {
            var existMarker = model.formatMarkerExist(response.data.data, params)
            var temDlData = this.appendMarkerToDl(existMarker)  
            
            this.dlData = ((data)=> data)(temDlData)
          }
        })
      }
    },
    appendMarkerToDl(markers) {
      for (var i = 0; i < this.dlData.data.length; i++) {
        // this.dlData.data[i].marker = markers[i]
        Vue.set(this.dlData.data[i], "marker", markers[i])
      }
      return this.dlData
    },
    renderPolygons(key, date) {
      var params = {
        type: 10,
        index: key,
        code: this.code,
        start: dateUtil.formatDate(date),
        end: dateUtil.formatDate(date),
        status: 1
      }
      this.fetchPolygon(params)
    },
    getLineChartParams(key, code) {
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
    lineChart(options) {
      
      if (this.lineReqHan) {
        this.lineReqHan.cancelRequest("cancel request")
        this.lineReqHan = null
      }

      this.chartLoading = true
      this.lineReqHan = request.lineData(options)

      this.lineReqHan.then((response) => {
        this.lineReqHan = null
        if (response && response.status === 200) {
          response = response.data;
          if (response && response.status == '0') {
            var formated = model.formatMonitorLine(response, options);
            this.echartData = charts.getLine(formated);
          } else {
            this.echartData = null
          }
          this.chartLoading = false
        }
      });
    },
    getBarChartParams(key, code) {
      var end = dateUtil.formatDate(new Date()),
        startDate = new Date('2010-01-01'),
        startStr = dateUtil.formatDate(startDate),
        url =  `${key}/${code}/${startStr}/${end}`
      
      var params = {
        url: url,
        legend: this.legend,
        startDate: startDate,
        endDate: new Date()
      }

      return params
    },
    barChart(options) {

      if (this.barReqHan) {
        this.barReqHan.cancelRequest("cancel request")
        this.barReqHan = null
      }

      this.chartLoading = true
      this.barReqHan = request.barData(options)

      this.barReqHan.then((response) => {
        this.barReqHan = null
        if (response && response.status === 200) {
          response = response.data;
          if (response && response.status == '0') {
            var formated = model.formatMonitorBar(response, options);
            this.echartData = charts.getBar(formated);
          
          } else {
            this.echartData = null
          }
          this.chartLoading = false
        }
      });
    },
    setLegend(legend) {
      var legends = []
      for(var _key in legend) {
        var i = 5 - parseInt(_key);
        legends[i] = {};
        legends[i].words = legend[_key].name;
        legends[i].topTitle = legend[_key].up;
        legends[i].bottomTitle = legend[_key].down;
        legends[i].bgcolor = legend[_key].color;
        legends[i].fontColor = legend[_key].fontColor;
      }
      this.legends = legends;
    },
    changeIndex(index) {
      this.backList = true
      this.curIndex = index    
    },
    changeYear(year){
      this.isOneYear = (year == 1)
    },
    setChartTip(index) {
      var jsonStr = this.list[index].product_detail.toString().replaceAll("'",'"')
      var chartTipObj = JSON.parse(jsonStr)
      var key = this.list[index].product_key

      if (this.isGrow) {
        this.lineSection = chartTipObj[key].help
      }

      key += this.isGrow ? (this.isOneYear ? '-1' : '-5') : ''
      this.barSection = chartTipObj[key].help
    },
    getAllTitle(){
      if(this.isGrow){
        this.section = 'growing';
        this.reportName = '选择长势产品'
        this.opactlTitle = '长势图层透明度'
        this.reportSection = '作物长势分析报告'
        this.reportTitle = this.reportSection
        this.listSection = '根据农作物的生长阶段，结合光照、温度、水分等环境因素，对长势进行科学分析。'
      }else {
        this.section = 'drought';
        this.reportName = '选择旱情产品'
        this.opactlTitle = '旱情图层透明度'
        this.reportSection = '旱情分析报告'
        this.reportTitle = this.reportSection
        this.listSection = '跟据农作物的干旱情况，分析出干旱面积、致灾因素等，并提出合理生产建议。'
      }
    },
    fetchPolygon(params) {

      request.modisMarkerInfo(params).then((res) => {
        if (res && res.status === 200 && res.data.status === 0) {
          
          var data = res.data.data
          this.polygonGeomtries = []
          for(var year in data) {

            for(var period in data[year]) {
              
              for (var i = 0; i < data[year][period].length; i++) {
                var item = {
                  marker_id: data[year][period][i].marker_id,
                  title: data[year][period][i].title,
                  color: data[year][period][i].color,
                  geom: data[year][period][i].geom,
                  desc: data[year][period][i].desc,
                  lonlat: data[year][period][i].center
                }
                this.polygonGeomtries.push(item)
                
              }
            }
          }
          
          drawCtl.removePolygons()
          drawCtl.renderPolygons(this.polygonGeomtries)

        } else {
          drawCtl.removePolygons()
        }
      })
    },
    changeLoadOpacity(color) {
      setTimeout(()=> {
        var dom = document.getElementsByClassName('el-loading-mask')
        elementUtil.setDomStyle(dom, 'backgroundColor', color)
      })
    },
    getMapViewExtent(bounds) {
      var minX = this.menuWidth + 358 + 10
      var minY = 48
      var maxX = this.screenWidth
      var maxY = this.getScreenHeight

      var viewPixel = [minX, minY, maxX, maxY]
      var mapPixel = [0,0, this.screenWidth, this.getScreenHeight]

      var fitedExtent = this.$refs.map.getFitExtent(viewPixel, mapPixel)

      return fitedExtent
    },
    fitToView(bounds) {
      setTimeout(()=> {
        var extent = this.getMapViewExtent(bounds)
        this.map.getView().fit(extent)
      }, 100)
    }
  },
  watch: {
    curIndex: function (index) {
      this.chartType = ''
      this.listTitle = this.list[index].product_title
      this.misc = this.list[this.curIndex].product_misc
      var key = this.list[this.curIndex].product_key
      this.isGrow = (configData.growTarget.name.indexOf(key) >= 0)
      this.legend = configData.productLegendConf[key]

      this.setLegend(this.legend)
      
      if (this.currentTreeNode) {
        this.getTreeNode(this.currentTreeNode)
      } else {
        this.tryAddLayers()
      }

      this.setChartTip(index)
      this.getAllTitle()
      this.showPopMsg(`已切换至${this.listTitle}`)
    },
    chartType: function(chartType) {
      this.echartData = null
      var key = this.list[this.curIndex].product_key

      if (chartType == 'line') {
        var params = this.getLineChartParams(key, this.code)
        this.lineChart(params);

      } else if (chartType == 'bar') {
        key += this.isGrow ? (this.isOneYear ? '-1' : '-5') : ''
        var params = this.getBarChartParams(key, this.code)
        this.barChart(params)

      } else {
        return
      }
      var chartTipObj = JSON.parse(this.list[this.curIndex].product_detail.toString().replaceAll("'",'"'));
      this.chartTitle = chartTipObj[key].title
      this.chartTip = chartTipObj[key].help
    },
    isOneYear: function(isOneYear) {
      this.chartType = ''
      var productType = this.getKey()
      if (!this.noLayer) {
        this.tryAddLayers()
        this.$refs['popMessage'].showDialog()
        this.popTitle = isOneYear ? '地图已切换至与近一年长势对比' : '地图已切换至与近五年长势对比'

        this.setChartTip(this.curIndex)
      }
    },
    menuWidth(width) {
      if (width > 0) {
        this.timelineWidth = this.screenWidth - width - 20
      }
    },
    screenWidth(width) {
      if (width > 0) {
        this.timelineWidth = width - this.menuWidth - 20
      }
    },
    bounds(bounds) {
      this.fitToView(bounds)
    },
    leftLoading(loading) {
      if (loading && this.firstLoad) {
        this.changeLoadOpacity("rgba(255,255,255,1)")
      }
    },
    firstLoad(loading) {
      if (!loading) {
        this.changeLoadOpacity("rgba(255,255,255,.9)")
      }
    },
    chartCode(code) {
      if (this.list.length > 0) {
        var key = this.list[this.curIndex].product_key
        if (this.chartType == 'line') {
          var params = this.getLineChartParams(key, code)
          this.lineChart(params);

        } else if (this.chartType == 'bar') {
          key = this.getKey()
          var params = this.getBarChartParams(key, code)
          this.barChart(params)
        }
      }
    },
    showPopDetail(showHover) {
      drawCtl.enableHoverTip(showHover)
    },
    curDate(date) {
      this.showPopDetail = false
      this.currentYear = date.getFullYear()
      this.fetchPreYearAtoms(this.currentYear)
    }
  },
  directives: {
    limitLine: {
      bind: function(el) {
        $clamp(el, {
          clamp: 2
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
    })
  },
  beforeDestroy(){
    drawCtl.destroy()
  },
  directives: {
      limitLine: {
        bind: function(el) {
          $clamp(el, {
            clamp: 2
          })
        }
      }
    },
  components: {
    vLegend,
    leftTab,
    dateSelector,
    vList,
    viewreport,
    reportlist,
    vTime,
    tree,
    expectData
  }
}
</script>

<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  @import '../../assets/style/common';
  .detail-height {
    height: 410px;
    overflow-x: hidden;
  }
  .m-lefttab {
    width: 100%;
  }
  .e-chart {
    .adv-boxshadow();
    position: absolute;
    top: 175px;
    background: #fff;
    width: 318px;
    border-radius: 2px;
    text-align: left;
    
    p {
      margin: 5px 0 0 10px; 
    }
    button {
      line-height: 20px;
      display: inline-block;
      width: 78px;
      height: 26px;
      margin: 5px 5px 10px 10px;
      cursor: pointer;
      background: #e3e3e3;
      color: #2c3e50;
      border: 1px solid #898989;
      border-radius: 4px;
      em {
        margin-left: 2px;
      }
    }
  }
  .echart {
    width: 700px;
    height: 400px;
    padding-bottom: 20px;
  }
  .chart-title {
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    color: #6ea363;

    .chart-title-p {
      font-size: 16px;
      color: #7e6139;
      .help {
        width: 18px;
        height: 18px;
        background: #fff;
        border: 1px solid #bbbec2;
        border-radius: 16px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        color: #bbbec2;
        margin: 0 10px;
        font-size: 15px;
      }
    }
    .chart-area-tree {
      margin-top: -26px;
      margin-right: 20px;
    }
  }
  .date-selector {
    position: fixed !important;
    bottom: 10px;
    right: 10px;
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
  }
  .crop-test {
    padding: 0px 14px;
    background: #9fd032;
    .crop-test-titile {
      .adv-title-list();
      margin-top: 8px; 
    }
     .phase {
      top: 14px;
      padding: 8px 6px;
      background: #fff;
      border-radius: 2px;
      cursor: pointer;
    }
    .next-period {
      right: -8px;
    }
    .pre-period {
      left: 165px;
    }
    .crop-introduce {
      .adv-text-line-height-normal();
      color: #fff;
      padding-bottom: 14px;
    }
  }
  .tree-bg {
    padding: 20px 14px 0px 14px;
    background: #f2fee7;
    border-bottom: 1px solid #cdd0d2;

    .area-tree {
      width: 165px;
    }
    .sub-area-tree {
      width: 134px;
      float: right;
      margin-top: -34px;
      margin-right: 0px;
    }
  }
  .check-data-container {
    width: 100%;
    padding: 20px 14px 0 14px;
    box-sizing: border-box;
    .check-data {
      .check-data-title {
        .adv-title-big();
      }
      .check-data-section {
        .adv-text-line-height-normal();
        margin: 14px 20px;
        color: #272727;
      }
    }
  }
  .m-select-list {
    margin: 0 0 0 10px;
    padding-bottom: 10px;
    li {
      position: relative;
      height: 94px;
      border-top: 1px dashed #d5d5d5;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        margin: 16px 0 0 8px;
      }
      .m-list-right {
        width: 100%;
        padding: 0 0 10px 77px;
        box-sizing: border-box; 
        .list-chart {
          position: relative;
          margin-top: 7px;
    
          .list-chart-title{
            .adv-title-normal();
            font-weight: normal;
          }
          .popupctl-btn {
            .adv-fixed-normal-primary-btn();
            position: absolute;
            top: 0;
            right: 19px;
            font-size: 13px;
            border-radius: 4px;
          }
        }
        .list-section {
          .adv-text-line-height-normal();
          height: 44px;
          color: #a4a4a4;
          margin-right: 10px;
          overflow: hidden;
        }
      }
      &:hover{
        background: #eee;
      }
    }
  }
  .monitor-report ul {
    .report-single {
      width: 100%;
    }
  }
  .pop-echart {
    min-height: 400px;
    z-index: 0;
  }
.we-expect-data {
  width: 640px;
  left: 50%;
  top: 46%;
  transform: translate(-50%,-50%);
  text-align: center;
  i {
    font-size: 24px;
    color: #bdb9ba;
  }
  .none-place-data {
    color: #bdb9ba;
    font-size: 18px;
    margin-top: 4px;
  }
  .other-data {
    font-size: 14px;
    color: #e34601;
  }
}
.time-axis {
  width: 48px;
  height: 22px;
  text-align: center;
  line-height: 22px;
  right: 10px;
  bottom: 186px;
  background: #fff;
  border-radius: 4px 4px  0px 4px;
  cursor: pointer;
} 
  .pop-fixed-width-container {
    .adv-common-border-radius();
    display: none;
    position: absolute;
    top: -150px;
    left: -114px;
    width: 228px;
    height: 123px;
    background: @assistant-bg;
    .pop-main {
      padding: 14px 10px 10px 10px;
      border-bottom: 1px solid #c9c9c9;
      .pop-title{
        .adv-font-big();
      }
      .pop-content {
        .adv-font-small();
        widows: 208px;
        height: 38px;
        -webkit-line-clamp: 2;
        height: 38px;
        line-height: 22px;
        margin-top: 4px;
      }
    }
    .view-all-report {
      margin-top: 8px;
      text-align: center;
      color: #d17302;
      cursor: pointer;
      .view-all-report-icon {
        font-size: 14px;
      }
      .view-all-report-content {
        margin-left: 8px;
      }
    }
  }

  .pop-view-content-container {
    .adv-common-border-radius();
    position: absolute;
    left: -132px;
    width: 265px;
    background: @assistant-bg;
    .close-btn{
      .adv-font-small();
      top: 6px;
      right: 6px;
      cursor: pointer;
    }
    .pop-main {
      padding: 18px 10px 10px 10px;
      border-bottom: 1px solid #c9c9c9;
      .pop-title{
        .adv-font-big();
      }
      .pop-content {
        .adv-font-small();
        text-indent: @font-indent-small;
        line-height: 22px;
        margin-top: 4px;
      }
    }
    .view-weather {
      .adv-height(46px);
      text-align: center;
      .view-weather-btn {
        .adv-normal-primary-btn();
        padding: 8px 40px;
      }
    }
  }
</style>