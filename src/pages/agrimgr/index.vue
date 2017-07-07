<template>
  <div class="agri-mgr" @click="hidePopup">
    <my-map class="map" 
      @initMap="initMap" 
      background="#fff"
      :top="97"
      borderRadius="4px"
      :switchCtl="true"
      :maxZoom="20" ref="map"
      :centerCtl="{use: true}"
      @setCenter="setCenter"
      :useTools="true">
    </my-map>

    <div>
      <left-tab
        class="pr loading-container" 
        :title="'农田精细化监测管理'"
        :showList="showList"
        :leftTab="[]"
        @toggleList="toggleTabList"
        >
        
        <template slot="list">
          <div class="agri-container">
            <div v-loading.lock="leftLoading && showList" 
            class="farm-bg" :style="{'max-height': getScreenHeight - 120 + 'px'}">
                <div class="pr">
                  <h3 class="farm-title">{{farmResult}}监测结果</h3>
                  <span  v-show="!inOverviewPage" @click="inOverviewPage = true" class="back-agrimgrlist ps"><i class="iconfont icon-icon-copy"></i>返回概述</span>
                  <tb-detail
                    :tableData="tableData"
                    :className="inOverviewPage ? 'left-tab-animation-in-left': 'left-tab-animation-out-left'"
                    @sortTableByHealth="sortTableByHealth"
                    @sortTableByArea="sortTableByArea"
                    @showLayerById="highLightLandBlockById">
                  </tb-detail>

                  <div v-show="inOverviewPage">
                    <div class="bg">
                      <div class="filtered">
                        <h3 class="filtered-title">作物情况筛选</h3>
                        <div class="filter-selected">
                          <div class="filtered-content clear">
                            <span v-for="filterItem in displayNames" v-if="filterItem!=''">{{filterItem}}</span>
                          </div>
                          <div class="select-btn-container">
                            <span @click="showFilterList = true">选择条件<i class="iconfont icon-icon-copy-copy"></i></span>
                          </div>
                        </div>
                      </div>

                      <div v-show="showFilterList" class="width:200px">
                        <filter-list 
                          :show="showFilterList"
                          :hideFilterTree="hideFilterTree"
                          :relationTree="relationTree"
                          :ownerCrops="ownerCrops"
                          @doFilterCb="doFilterCb"
                          @sliderOutFliter="showFilterList = false"
                          @initTreeStatus="initTreeStatus">
                        </filter-list>
                      </div>
                        

                      <crop-desc 
                        :cropDescData="cropDescData"
                        @showTableDetail="showTableDetail">
                      </crop-desc>
                    </div>
                  </div>

                  <healthy 
                    :legend="healthyLegend"
                    :options="healthyOptions">
                  </healthy>

                  <div class="btn-container clear ps " @click.stop="hidePopup">
                    <span class="dl-report fl no-select" @click="downloadData">
                      <i class="iconfont icon-xiazai1"></i>
                      <em>下载本期数据</em>
                    </span>
                    
                    <span class="watch-history watch-phase no-select fl">
                      <i class="iconfont icon-search hover-hide"></i>
                      <em class="hover-hide">查看往期</em>

                      <i class="hover-show animated fadeInRight fade-animation hide-animation">
                        <i class="el-icon-arrow-left" @click="jumpMonth(-1)"></i>
                        <i class="hover-show-text" @click="showDateSelector($event)">{{currentPhase}}</i>
                        <i class="el-icon-arrow-right" @click="jumpMonth(1)"></i>
                      </i>
                    </span>

                    <div @click.stop="hidePopup" class="date-sel watch-history ps pop-zIndex">
                      <date-selector
                        :showPop="showDatePop"
                        :curDate="curDate"
                        :startDate="start_date"
                        @click.native="stopEvent"
                        @changeDate="changeDate"
                        :exist="layerInfo">
                      </date-selector>
                    </div>
                  </div>       
                </div>
            </div>
            
            <div 
              class="ps opacity-control-border"
              :class="showList ? 'agr-to-right' : 'agr-to-left'" 
              >
              <div class="opacity-control">
                <template>
                  <el-slider 
                  v-model="layerOpacity"
                  :show-tooltip="false"
                  vertical
                  height='102px'></el-slider>
                </template>
              </div>
              <div class="opacity-control-value">{{layerOpacity}}%
              </div>
              <div class="opacity-text">透明度</div>
            </div>
          </div>
        </template>
      </left-tab>
    </div>
    
    
    <!-- 右侧弹窗 -->
    <pop-detail
      :showPopDetail="showPopDetail"
      :landId="landId"
      :landCrop="landCrop"
      :cropItem="cropItem"
      :cropHistoryData="cropHistoryData"
      :healthyStatus="healthyStatus"
      :yieldStats="yieldStats"
      :allLineChart="allLineChart"
      :nearTowYear="nearTowYear"
      :popClassName="popClassName"
      :popDetailIndex="popDetailIndex"
      :responsiblePersonInfo="responsiblePersonInfo"
      :lonlat="lonlat"
      @closeDetail="closeDetail"
      @changeLayer="changeLayer">
    </pop-detail>
    
    <!-- 右侧作物颜色标记 -->
    <lagend>
    </lagend>
    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
  </div>
</template>

<script>
import leftTab from 'components/leftTab'
import filterList from './filter'
import cropDesc from './cropdesc'
import healthy from './healthy'
import tbDetail from './tbdetail'
import popDetail from './popdetail'
import dateSelector from './datesel'
import lagend from './lagend'

import request from 'api/request.js'
import model from 'api/model.js'
import mapCtl from './map'
import configData from '../../config/data.js'
import chartCtl from './echart/index.js'
import {dateUtil} from '../../plugins/utils.js'
import {elementUtil} from 'plugins/utils.js'

import {mapGetters} from 'vuex'
import polygonMini from './map/polygonmini.js'
import expectData from 'components/expectData/'
 

export default {
  data() {
    return {
      leftLoading: false,
      firstLoad: true,
      showList: true,
      backList: true,
      inOverviewPage: true,

      startDate: '2016-07-25',
      endDate: '2016-08-30',
      areaName: configData.NDVI.areaName,
      satelLite: "landsat8",
      landGeomtryData: {},
      layerInfo: [],
      currentLayer: null,
      currentSld: '',
      ndviLayerName: '',
      gradeLayerName: '',
      yieldLayerName: '',

      showFilterList: false,
      displayFilteredData: [-1, -1, -1, -1],
      displayNames: ["全区", "", "", ""],
      apiParams: [],
      filteredFarmland: {},
      relationTree: null,
      ownerCrops: [],
      responsiblePersonInfo:{},

      cropDescData: null,

      healthyOptions: [],
      healthyLegend: [
        {
          legendClass: 'good',
          number: '30%',
          status: '好'
        },
        {
          legendClass: 'better',
          number: '30%',
          status: '稍好'
        },
        {
          legendClass: 'normal',
          number: '30%',
          status: '一般'
        },
        {
          legendClass: 'poor',
          number: '30%',
          status: '稍差'
        },
        {
          legendClass: 'bad',
          number: '30%',
          status: '差'
        }
      ],

      tableData: [],
      landId: null,
      landCrop: '',
      farmResult: '2015年第3期 ( 3月中旬 ) ',

      showPopDetail: false,
      popDetailIndex: 0,  
      
      filterIds: [],

      popTitle: '',

      curDate: new Date(),
      start_date: new Date("2010-01-01"),
      showDatePop: false,

      cropItem: [
        { name: '种植面积',value: '200亩'},
        { name: '种植作物',value: '水稻'},
        { name: '健康状况',value: '优'}
      ],
      cropHistoryData: [],
      healthyStatus: '',

      yieldStats: {},

      cropHealthyData: {},
      cropYieldData: {},

      objectId: '',

      allNdviValue: null,
      allLineChart: null,
      nearTowYear: null,

      dataPath: [
        "http://dev-temp.oss-cn-beijing.aliyuncs.com/shared/doc/20160727%E5%86%9C%E5%9C%BA%E8%AE%A1%E7%AE%97%E6%95%B0%E6%8D%AE%20.xlsx",
        "http://dev-temp.oss-cn-beijing.aliyuncs.com/shared/doc/20160828%E5%86%9C%E5%9C%BA%E8%AE%A1%E7%AE%97%E6%95%B0%E6%8D%AE%20.xlsx"
      ],
      cropIcons: null,
      growStep: [
        {
          "135": "孕穗抽穗期",
          "134": "抽雄期",
          "140": "结荚期",
          "119": "幼苗期",
        },
        {
          "135": "乳熟期",
          "134": "乳熟期",
          "140": "结荚期",
          "119": "发棵期",
        }
      ],
      healthyColors: ["#346b19", "#619323", "#b7aa00", "#fda02e", "#d00303"],
      ndviPhase: 0,
      currentPhase: '',

      popClassName: '',

      HEALTH_DIVID: 2,
      healthColor: '',
      unhealthColor: '',

      vecLayer: null,
      layerOpacity: 90,
      hideFilterTree:true,
      lonlat: []
    }
  },
  computed: {
    ...mapGetters({
        getScreenHeight: 'getScreenHeight',
        menuWidth: 'menuWidth'
      })
  },
  mounted() {
    this.initColorIcons()
    this.initLandOwnerInfo()
    vueBus.$on('mapDrawHandler', this.mapDrawHandler)

  },
  methods: {
    initTreeStatus(status){
      this.hideFilterTree = status
    },
    figTime(data) {
      var te = []
      var start = new Date()
      for (var i = 0; i < data.length; i++) {
        var geom = JSON.parse(data[i].geom)
        var points = geom.coordinates[0][0]
        var result = polygonMini.scalePolygon(points, -5)
        te.push(result)
      }

      var end = new Date()
      console.log(end - start, te)
    },
    initColorIcons() {
      var ndviCnf = configData.ndviLevel
      const HEALTH_GRADE = 5
      const UNHEALTH_GRADE = 1
      this.healthColor = ndviCnf[HEALTH_GRADE].color
      this.unhealthColor = ndviCnf[UNHEALTH_GRADE].color

      for(var grade in ndviCnf) {
        this.healthyColors[parseInt(grade)] = ndviCnf[grade].color
      }

      this.cropIcons = configData.agrimgrColor.crop
    },
    mapDrawHandler({maptool, ndvi}) {
      
      if(maptool) {
        mapCtl.unbindClickEvent()
        mapCtl.unbindHoverEvent()

      } else {
        mapCtl.bindClickEvent()
        mapCtl.bindHoverEvent()
      }
    },
    initMap (map) {
      this.map = map;
      this.setCenter()
    },
    setCenter() {
      var view = this.map.getView(),
        zoomLev = configData.NDVI.zoomLevel,
        coordinates = configData.NDVI.coordinates
      view.setZoom(zoomLev)
      view.setCenter(coordinates)
    },
    stopEvent(event) {
      event.stopPropagation()
    },
    toggleTabList(isShow) {
      this.showList = isShow;
    },
    hidePopup() {
      this.showDatePop = false
      this.hideFilterTree = false
    },
    showDateSelector(event) {
      event.stopPropagation()
      this.showDatePop =! this.showDatePop
    },
    jumpMonth(step) {
      if (step === 1) {
        if (this.ndviPhase < this.layerInfo.length - 1) {
          this.setPhaseIndex(this.ndviPhase + step)

        } else {
          this.popTitle =  "已经是最新的监测结果了"
          this.$refs['popMessage'].showDialog()
        }
      }
      if (step === -1) {
        if (this.ndviPhase > 0) {
          this.setPhaseIndex(this.ndviPhase + step)
          
        } else {
          this.popTitle =  "已经是最早的监测结果了"
          this.$refs['popMessage'].showDialog()
        }
      }
    },
    downloadData() {
      elementUtil.downLoad(this.dataPath[this.ndviPhase])
    },
    changeDate(dateInfo) {
      if (dateInfo.noEarlier) {
        this.popTitle = dateInfo.tips ? dateInfo.tips : "已经是最早的监测结果了";
        this.$refs['popMessage'].showDialog()

      } else if (dateInfo.noLater) {
        this.popTitle =  dateInfo.tips ? dateInfo.tips : "已经是最新的监测结果了";;
        this.$refs['popMessage'].showDialog()
      }
      if (dateInfo.date) {
        this.curDate = new Date(dateInfo.date)
      }
      if (dateInfo.index !== undefined) {
        this.setPhaseIndex(dateInfo.index)
        this.changeLayer(this.popDetailIndex)
      }
    },
    showPopMsgUnAutoHide(msg) {
      this.$refs['popMessage'].showUnAutoHideDialog()
      this.popTitle = msg
    },
    hidePopMsg() {
      this.$refs['popMessage'].hidePopMsgImmediate()
    },
    initLandOwnerInfo() {
      this.showPopMsgUnAutoHide("图层加载中...")
      this.fetchGeometries()
      this.fetchRelationTree()
      this.fetchCrop()
    },
    fetchGeometries() {
      var data = {
        data: [{ "area_name": this.areaName  }]
      }
      request.landGeom(data).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.landGeomtryData = response.data.data[this.areaName]

          this.fetchNdviLayers()
        }
      })
    },
    fetchRelationTree() {
      request.landOwnerRelation(this.areaName).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.relationTree = response.data.data
        }
      })
    },
    fetchCrop() {
      this.leftLoading = true
      request.landOwnerCrop(this.areaName).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.ownerCrops = []
          this.ownerCrops = response.data.data
          
          this.apiParams = [-1, [-1, -1], -1, -1]
        }
      })
    },
    fetchNdviLayers() {
      var data = {
        start_date: this.startDate,
        end_date: this.endDate, 
        area_name: this.areaName,
        satellite_name: this.satelLite
      }
      request.getAllNdviInfo(data).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          var formated = model.formatNdviInfo(response.data.data)
          this.layerInfo = formated

          this.setPhaseIndex(formated.length - 1)
          this.fetchNdviChartData()

          this.vecLayer = mapCtl.addVectorLayer(this.landGeomtryData, this) 
          this.hidePopMsg()
          
        } else {
          console.log("We don't have all land type area data")
        }
      })
    },
    setPhaseIndex(index) {
      this.ndviPhase = index

      var year = this.layerInfo[index].date.substr(0, 4)
      this.currentPhase = `${year}年第 ${index+1} 期`
      this.curDate = new Date(this.layerInfo[index].date)
      
      this.fetchFilterData(this.apiParams)
      this.setCurrentYear(index)      
      this.setLayerName(index)
      this.fetchStatsData()
    },
    setCurrentYear(index) {
      this.currentYear = this.layerInfo[index].date.substr(0, 4)
      mapCtl.setCurrentYear(this.currentYear)
    },
    setLayerName(index) {
      this.ndviLayerName = this.layerInfo[index].ndviLayer
      this.gradeLayerName = this.layerInfo[index].gradeLayer
      this.yieldLayerName = this.layerInfo[index].yieldLayer
    },
    fetchStatsData() {
      this.fetchHealthyStatus(this.gradeLayerName)
      this.fetchYieldStatus(this.yieldLayerName)
    },
    doFilterCb(filteredData) {
      this.showFilterList = false

      this.displayFilteredData = filteredData.displayNames
      this.apiParams = filteredData.apiParams

      this.setDisplayName(filteredData.displayNames)
      this.fetchFilterData(filteredData.apiParams)
    },
    setDisplayName(displayNames) {
      this.displayNames[0] = displayNames[0] === -1 ? "全区" : displayNames[0] 
      this.displayNames[1] = displayNames[1] === -1 ? "" : displayNames[1] 
      this.displayNames[2] = displayNames[2] === -1 ? "" : displayNames[2] 
      this.displayNames[3] = displayNames[3] === -1 ? "" : displayNames[3].join('，') 
    },
    fetchFilterData(params) {
      if (params && params.length === 4) {
        var data = {
          "date": dateUtil.formatDate(this.curDate), // 7/25-8/30 区间有值
          "area_name": this.areaName, 
          "satellite_name": this.satelLite,
          // "select_area_name": params[0], 
          "land_area": params[1], 
          "grade_ndvi": params[2], 
          "crop_ids": params[3]
        }

        if (params[0] !== -1) {
          data.select_area_name = params[0]
        }
        if (params[1] === -1) {
          data.land_area = [-1, -1]
        }

        this.leftLoading = true
        request.filterLands(data).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            this.filteredFarmland = response.data.data
            this.formatFilteredData(this.filteredFarmland)
          }
          this.leftLoading = false
          this.firstLoad = false
        })
      }
    },
    formatFilteredData(landData) {
      if (!landData.land_datas) {
        // 无数据
        
      } else {

        this.formatCropDetail(landData.land_datas, landData.area_stats)
        this.formatTableAndFilter(landData.land_datas)
      }

      this.setHealtyBarOption(landData.ndvi_grade_stats)
    },
    formatCropDetail(sourceData, areaStats) {
      var ndviConfig = configData.ndviLevel
      var cropColor = configData.agrimgrColor.crop

      this.cropDescData = {}
      this.cropDescData.hasProblem = false
      this.cropDescData.cropList = []
      for (var i = 0; i < areaStats.crop_stats.length; i++) {
        this.appendCropList(areaStats.crop_stats[i], cropColor, this.cropDescData.cropList, this.displayNames)
      }

      this.setTitle(areaStats, this.displayNames)
      this.setSubTitle(areaStats, this.displayNames)
    },
    setTitle(areaStats, displayNames) {
      var areaName = displayNames[0]
      var cropNames = displayNames[3] === '' ? '' : displayNames[3]

      var areas = areaStats.total_stats.total_area 
                  ? parseInt(areaStats.total_stats.total_area * 15 / 10000)
                  : 0
      // this.cropDescData.title = {areaName, cropNames, areas}
      this.cropDescData.title = `${areaName}${cropNames}种植总面积共${areas}亩`
    },
    setSubTitle(areaStats, displayNames){
      var landArea
      var healthy = ''
      
      var healthyLandCount = 0
      var healthyArea = 0
      var healthyStatus = (displayNames[2] === "不健康") ? false : true
      
      var areaStatus = displayNames[1] === ""
      var areaDesc = displayNames[1]

      var totalLandCount = areaStats.land_area_in_range_stats.total_land_count
      var totalArea = areaStats.land_area_in_range_stats.total_area

      if (!healthyStatus) {
        healthy = displayNames[2]
        healthyLandCount = areaStats.land_area_in_range_stats.total_ill_land_count
        healthyArea = areaStats.land_area_in_range_stats.total_ill_area


      } else {
        healthy = "健康"
        healthyLandCount = areaStats.land_area_in_range_stats.total_health_land_count
        healthyArea = areaStats.land_area_in_range_stats.total_health_area
      }

      totalArea = parseInt(totalArea * 15 / 10000)
      healthyArea = parseInt(healthyArea * 15 / 10000)


      if (areaStatus) {
        landArea = `地块共${totalLandCount}个`
      } else {
        landArea = `${displayNames[1]}地块共${totalLandCount}个${totalArea}亩`
      }

      this.cropDescData.desc = {healthyStatus, areaDesc, areaStatus, healthy, totalLandCount, totalArea, healthyLandCount, healthyArea}
      // this.cropDescData.desc = `${landArea}, 其中${healthy}地块共${healthyLandCount}个(共${healthyArea}亩)`
    },
    appendCropList(cropStats, cropColor, cropDesc, displayNames) {
      
      var totalStats = cropStats.total_stats
      var stats = cropStats.land_area_in_range_stats
      

      var _healthyStatus = (displayNames[2] === "不健康") ? false : true

      if (_healthyStatus) {
        this.appendHealthyCrop(totalStats, stats, cropColor, cropDesc, displayNames, cropStats)
      } else {
        this.appendIllCrop(totalStats, stats, cropColor, cropDesc, displayNames, cropStats)
      }
      
    },
    appendHealthyCrop(totalStats, stats, cropColor, cropDesc, displayNames, cropStats) {
      
      var icons = this.cropIcons

      var id = cropStats.crop_id,
        healthColor = this.healthColor,
        crop = this.getCropName(id),
        cropIcon = 'icon-crop-' + id,
        color = cropColor[id].color,
        bg = cropColor[id].bg,
        
        totalArea = parseInt(totalStats.total_area * 15 / 10000),

        inrangeLandCount = stats.total_land_count,
        inrangeArea = parseInt(stats.total_area * 15 / 10000),

        problemCount = stats.total_ill_land_count,
        problemArea = parseInt(stats.total_ill_area * 15 / 10000),

        healthyCount = stats.total_health_land_count,
        healthArea = parseInt(stats.total_health_area * 15 / 10000),
        
        areaSizeDisplayName = displayNames[1] === "" ? displayNames[1] : displayNames[1] + "的",
        filterHealthy = true

      cropDesc.push({id, crop, cropIcon, color,bg, 
        inrangeLandCount, inrangeArea, totalArea, problemCount, problemArea,
        healthyCount, healthArea, areaSizeDisplayName, filterHealthy, healthColor})
    },
    appendIllCrop(totalStats, stats, cropColor, cropDesc, displayNames, cropStats) {
      
      var icons = this.cropIcons

      var id = cropStats.crop_id,
        healthColor = this.unhealthColor,
        crop = this.getCropName(id),
        cropIcon = "icon-crop-" + id,
        color = cropColor[id].color,
        bg = cropColor[id].bg,
        
        totalArea = parseInt(totalStats.total_area * 15 / 10000),

        inrangeLandCount = stats.total_land_count,
        inrangeArea = parseInt(stats.total_area * 15 / 10000),

        problemCount = stats.total_ill_land_count,
        problemArea = parseInt(stats.total_ill_area * 15 / 10000),

        healthyCount = stats.total_health_land_count,
        healthArea = parseInt(stats.total_health_area * 15 / 10000),
        
        areaSizeDisplayName = displayNames[1] === "" ? displayNames[1] : displayNames[1] + "的",
        filterHealthy = false

      cropDesc.push({id, crop, cropIcon, color, bg,
        inrangeLandCount, inrangeArea, totalArea, problemCount, problemArea,
        healthyCount, healthArea, areaSizeDisplayName, filterHealthy, healthColor})
    },
    getCropName(id) {
      var name = ''
      for (var i = 0; i < this.ownerCrops.length; i++) {
        if (this.ownerCrops[i].crop_id === id) {
          name = this.ownerCrops[i].crop_name
          break
        }
      }
      
      return name
    },
    formatTableAndFilter(sourceData) {
      this.tableData = []
      this.filterIds = []
      var ndviConfig = configData.ndviLevel

      for(var key in sourceData) {
        this.appendFilterId(sourceData[key].land_object_id)

        this.appendTableData(key, sourceData, ndviConfig)
      }

      this.tableData.sort(this.sortTableData)
      this.clipBoundsLayer()
    },
    appendFilterId(id) {
      this.filterIds.push(id)
    },
    appendTableData(key, sourceData, ndviConfig) {
      var item = {
        id: sourceData[key].crop_id,
        name: sourceData[key].crop_name,
        area: Number(sourceData[key].land_area * 15 / 10000).toFixed(0),
        objectId: sourceData[key].land_object_id,
        healthy: ndviConfig[sourceData[key].ndvi_grade].name,
        grade: sourceData[key].ndvi_grade,
        color: this.healthyColors[sourceData[key].ndvi_grade]
      }
      this.tableData.push(item)
    },
    sortTableData(cur, next) {
      var result = 0
      if (cur.grade !== next.grade) {
        result = cur.grade - next.grade

      } else {
        result = next.area - cur.area
      }
      return result
    },
    sortTableByHealth(asc) {
      var result = 0
      var method

      if (asc) {
        method = (cur, next) => cur.grade - next.grade

      } else {
        method = (cur, next) => next.grade - cur.grade
      }
      this.tableData.sort(method) 
    },
    sortTableByArea(asc) {
      var result = 0
      var method 

      if (asc) {
        method = (cur, next) => cur.area - next.area
        
      } else {
        method = (cur, next) => next.area - cur.area
      }
      this.tableData.sort(method) 
    },
    setHealtyBarOption(healthyData) {
      var xAxis = [], yAxis = [];
      var displayName = configData.ndviLevel

      this.healthyOptions = []

      for(var healthyLevel in healthyData) {
        var color = this.healthyColors[healthyLevel]
        var value = (healthyData[healthyLevel].area * 15 / 10000 / 10000).toFixed(1)
        var percent = Number(healthyData[healthyLevel].percent).toFixed(0)
        var name = `${displayName[healthyLevel].name}：\n ${value}万亩`

        this.healthyLegend[5 - healthyLevel].number = percent + '%'
        this.healthyOptions.unshift({name, color, value, percent})
      }
    },
    showTableDetail(cropId) {
      this.inOverviewPage = false
      if (!cropId) {
        this.showAllTableDetail()

      } else {
        this.showTableDetailByCropId(cropId)
      }
    },
    showAllTableDetail() {
      this.formatFilteredData(this.filteredFarmland)
    },
    showTableDetailByCropId(cropId) {
      var tem = []
      this.formatFilteredData(this.filteredFarmland)
      for (var i = 0; i < this.tableData.length; i++) {
        if (cropId === this.tableData[i].id) {
          tem.push(this.tableData[i])
        }
      }
      this.tableData = tem
    },
    doClickEvent(id) {
      this.objectId = id
      this.showPopDetail = true
      mapCtl.highLightById(id, false)

      this.initPopDetailDataById(id)
    },
    clipBoundsLayer() {
      mapCtl.setSourceByFeilter(this.landGeomtryData, this.filterIds)
      // must after clip
      this.changeLayer(this.popDetailIndex)
    },
    highLightLandBlockById(id) {
      this.objectId = id
      this.showPopDetail = true

      mapCtl.highLightById(id, true)

      this.initPopDetailDataById(id)
    },
    initPopDetailDataById(id) {
      var detail = this.getPlantDetail(id)
      this.setPlantCropInfo(detail)
      this.setPlantHistroy(detail.land_crop)
      
      this.setHealthyDataById(id)
      this.setYieldDataById(id)

      this.setResponsiblePersonInfoById(id)
    },
    getCropHealthInfobyId(id) {
      var detail = this.getPlantDetail(id)
      var cropInfo = this.getCurrentYearCrop(detail.land_crop)

      var healthy = this.getHealthyById(id)

      return {...healthy, ...cropInfo}
    },
    getHealthyById(id) {
      var healthy = this.cropHealthyData[id] > this.HEALTH_DIVID ? "健康" : "不健康"
      var color = this.cropHealthyData[id] > this.HEALTH_DIVID ? this.healthColor : this.unhealthColor

      return {healthy, color}
    },
    changeLayer(index) {
      this.popDetailIndex = index
      this.currentSld = ''

      if (index === 0) {
        this.addCropLayer()
        this.doClipLayer(this.vecLayer)

      } else if (index === 1 || index === 3) {
        this.addNdviLayer()
        this.doClipLayer(this.currentLayer)

      } else {
        this.addYieldLayer(index)
        this.doClipLayer(this.currentLayer)
      }

    },
    addCropLayer() {
      mapCtl.setNormalStyle(true)

      if (this.currentLayer) {
        this.currentLayer.setVisible(false)
      }
    },
    addNdviLayer() {
      mapCtl.setNormalStyle(false)

      this.removeCurrentLayer()
      this.currentLayer = mapCtl.getNDVIlayer(this.ndviLayerName, this.layerOpacity)
      this.map.addLayer(this.currentLayer)
    },
    addYieldLayer(index) {
      mapCtl.setNormalStyle(false)
      this.removeCurrentLayer()
      var sld = mapCtl.getSldBody(this.yieldLayerName, index)
      this.currentLayer = mapCtl.getLayerBySld(this.yieldLayerName, sld, this.layerOpacity)
      this.map.addLayer(this.currentLayer)

      this.fetchYieldStatus(this.yieldLayerName)
    },
    removeCurrentLayer() {
      if (this.currentLayer) {
        this.map.removeLayer(this.currentLayer)
        this.currentLayer = null
      }
    },
    doClipLayer(layer) {
      var style = mapCtl.getClipStyle()
      var features = mapCtl.getClipFeature(this.landGeomtryData, this.filterIds)
      mapCtl.clipLayer(layer, features, style)
    },
    closeDetail() {
      this.showPopDetail = false

      mapCtl.setObjectId("")
      this.changeLayer(0) 
    },
    getPlantDetail(objectId) {
      var detail = []
      for (var i = 0; i < this.landGeomtryData.length; i++) {
        if (this.landGeomtryData[i].land_object_id === objectId) {
          detail = this.landGeomtryData[i]
        }
      }

      return detail
    },
    setPlantHistroy(detail) {
      var selectYear = this.layerInfo[this.ndviPhase].date.substr(0, 4)

      var currentYear = new Date().getFullYear()
      var crop = ''
      var year = 0
      var selected = false
      for (var i = 0; i < detail.length; i++) {
        crop = detail[i].crop_name
        year = detail[i].year + "年"
        
        selected = selectYear == detail[i].year

        if (currentYear === detail[i].year) {
          this.cropHistoryData[0] = {year, crop, selected}
          
        } else if (currentYear - detail[i].year === 1) {
          this.cropHistoryData[1] = {year, crop, selected}

        } else if (currentYear - detail[i].year === 2) {
          this.cropHistoryData[2] = {year, crop, selected}

        } else if (currentYear - detail[i].year === 3) {
          this.cropHistoryData[3] = {year, crop, selected}

        } else if (currentYear - detail[i].year === 4) {
          this.cropHistoryData[4] = {year, crop, selected}
        } 
      }
    },
    getCurrentYearCrop(detail) {
      var crop = '',
        id = '';

      for (var i = 0; i < detail.length; i++) {
        if (this.currentYear == detail[i].year) {
          crop = detail[i].crop_name 
          id = detail[i].crop_id
          
          break
        } 
      }
      return {crop, id}
    },
    setPlantCropInfo(detail) {
      var area = parseInt(detail.land_area * 15 / 10000)
      var cropInfo = this.getCurrentYearCrop(detail.land_crop)
      var growStep = this.getGrowPhase(cropInfo.id)
      this.landId = detail.land_object_id
      this.landCrop = detail.land_type
      this.cropItem =  [
        { name: '种植面积',value: area + '亩'},
        { name: '种植作物',value: cropInfo.crop},
        { name: '生长期',value: growStep}
      ]
    },
    getGrowPhase(id) {
      return this.growStep[this.ndviPhase][id]
    }, 
    fetchHealthyStatus(layerName) {
      this.cropHealthyData = null
      request.healthyStatus(layerName).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.cropHealthyData = response.data.data
        }
      })
    },
    fetchYieldStatus(layerName) {
      this.cropYieldData = null
      request.yieldStatus(layerName).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.cropYieldData = response.data.data
        }
      })
    },
    fetchNdviChartData() {
      if (!this.allNdviValue) {
        var postData = {
          "start_date": "2010-01-01", 
          "end_date": dateUtil.formatDate(new Date()), 
          "area_name": this.areaName, 
          "satellite_name": this.satelLite, 
          "land_type": 0
        }
        request.getAllNdviValue(postData).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            this.allNdviValue = model.formatLine4Ndvi(response.data.data)
            this.nearTowYear = chartCtl.getLine(this.allNdviValue.currentYear, this.allNdviValue.lastYear)
            this.allLineChart = chartCtl.allLine(this.allNdviValue)
            
            // add map hover event
            mapCtl.bindClickEvent()
            mapCtl.bindHoverEvent()
          } else {
            console.log("We don't have all ndvi data")
          }
        })
      }
    },
    setHealthyDataById(objectId) {
      if (this.cropHealthyData) {
        var healthyLevel = this.cropHealthyData[objectId]
        if (healthyLevel > this.HEALTH_DIVID) {
          this.healthyStatus = "好"
          this.popClassName = 'good'
        } else {
          this.healthyStatus = "差"
          this.popClassName = 'bad'
        }
      } else {
        setTimeout(() => {
          this.setHealthyDataById(objectId)
        }, 10)
      }
    },
    setYieldDataById(objectId) {
      if (this.cropYieldData) {
        var yieldLevel = this.cropYieldData[objectId]

        this.yieldStats = {}
        if (yieldLevel < -0.5) {
          this.yieldStats.className = "xiajiang down-green"
          
        } else if (yieldLevel >= -0.5 && yieldLevel <= 0.5) {
          this.yieldStats.className = "chiping flat-blue"

        } else if (yieldLevel > 0.5) {
          this.yieldStats.className = "shangsheng top-red"
        }
        this.yieldStats.value = Number(yieldLevel).toFixed(2) 
      } else {
        setTimeout(() => {
          this.setHealthyDataById(objectId)
        }, 10)
      }
    },
    setResponsiblePersonInfoById(objectId){
      this.responsiblePersonInfo = this.getPlantDetail(objectId)
    },
    
    changeLoadOpacity(color) {
      setTimeout(()=> {
        var dom = document.getElementsByClassName('el-loading-mask')
        elementUtil.setDomStyle(dom, 'backgroundColor', color)
      })
    },
    changeOpacity(value) {
      if (this.vecLayer) {
        this.vecLayer.setOpacity(value / 100)
      }
      if (this.currentLayer) {
        this.currentLayer.setOpacity(value / 100)
      }
    }
  },
  watch: {
    curDate(date) {
      var _date = dateUtil.formatDate(date)
      var month = date.getMonth() + 1
      var period = dateUtil.formatDateToPeriodZH(date).substr(-2 ,2)

      var year = date.getFullYear()
      var phase = `第 ${this.ndviPhase + 1} 期`
      this.farmResult = `${year}年${phase}(${month}月${period})`
    },
    showPopDetail(show) {
      this.showList = !show
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
    layerOpacity(value) {
      this.changeOpacity(value)
    },
    objectId(id) {
      var detail = this.getPlantDetail(id)
      var coordinates = JSON.parse(detail.geom).coordinates

      var polygon = new ol.geom.MultiPolygon(coordinates)
      var extent = polygon.getExtent()
      var center = ol.extent.getCenter(extent)
      this.lonlat = ol.proj.toLonLat(center)
    }
  },
  components: {
    leftTab,
    filterList,
    cropDesc,
    healthy,
    tbDetail,
    popDetail,
    dateSelector,
    lagend
  }
}
</script>

<style 
lang="less" scoped>
@import '../../assets/style/common';
.loading-container {
  width: 100%;
}
.bg {
  box-sizing: border-box;
  padding: 10px 14px;
  background: #ecfce0;
}
.pl14 {
  padding-left: 0px;
}
.top-red {
  color: #e60000;
}
.down-green {
  color: #82bd05;
}
.flat-blue {
  color: #01b8af;
}
.farm-bg {
  width: 100%;
  border-radius: 0px 0px 0px 4px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  .farm-title {
    .adv-title-normal();
    padding-left: 14px;
    box-sizing: border-box;
    line-height: 36px;
    border-bottom: 1px solid @border-color;
    background: @assistant-bg;
  }
  .filtered {
    .filtered-title {
      .adv-title-normal();
      margin-bottom: 11px;
    }
    .filter-selected {
      background: @assistant-bg;
      .adv-border-normal();
      .filtered-content {
        span {
          float: left;
          padding: 6px 8px;
          margin: 8px 0 8px 10px;
          background: #efefef;
          line-height: 1;
          .adv-common-border-radius();
        }
      }
      .select-btn-container {
        text-align: right;
        border-top: 1px solid @border-color;
        padding: 6px 10px;
        span {
          .adv-normal-primary-btn();
          i {
             margin-left: 4px;
            .adv-font-small();
          }
        }
      }
    }
  }
  .btn-container {
    left: 0;
    bottom: 0;
    width: 100%;
    background: #eeeeee;
    border-radius: 0px 0px 4px 4px;
    border-top: 1px solid @border-color;

    .date-sel {
      right: -24px;
      bottom: 44px;
      background: @assistant-bg;
      border: 1px solid #dcdcdc;
      .adv-boxshadow-soft();
      .adv-common-border-radius();
    }

    span {
      position: relative;
      width: 50%;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: #f6f5f5;
        i,em {
          color: #76aa01;
        }
      }
      i {
        color: #8b8b8b;
      }
      &:first-child:after {
        .adv-after(1px;32px;@border-color);
      }
    }
    .watch-phase {
      .el-icon-arrow-left,
      .el-icon-arrow-right,
      .hover-show-text {
        padding: 4px;
        border: 1px solid #c9c9c9;
        border-radius: 2px;
        background: @assistant-bg;
      }
      .hover-show-text {
        margin: 0 6px;
      }
      .hover-show {
        display: none;
      }
      &:hover {
        .hover-hide {
          display: none;
        }
        .hover-show {
          display: inline-block;
        }
      }
    }
  }
  .back-agrimgrlist {
    .adv-normal-primary-btn();
    right: 14px;
    top: 6px;
    padding: 0px 10px 0 3px;
    box-sizing: border-box;
    line-height: 22px;
    i {
      font-size: 12px;
      margin-left: 4px;
    }
  }
}
.opacity-control-border {
    overflow: hidden;
    width: 36px;
    height: 146px;
    top: 40px;
    left: @list-width;
    z-index: 1500;
    background: @assistant-bg;
    
    .adv-boxshadow();
    .adv-border-right-radius();
    .opacity-control {
      margin-top: 12px;
    }
    .opacity-control-value{
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      padding: 8px 0 4px;
    }
    &:hover{
      width: 48px;
      height: 162px;
      .opacity-control-value{
        font-size: 12px;
        line-height: 12px;
        text-align: center;
        padding: 8px 0 6px;
      }
      .opacity-control {
        margin-left: 6px;
      }
      .opacity-text{
        /*padding-bottom: 6px;*/
        text-align: center;
        line-height: 12px;
      }
    }
  }
  @keyframes agrToleft {
    0% {
      left: @list-width;
    }
    100% {

    }
  }
   .agr-to-left {
    .adv-animation(agrToleft;.4s;1;forwards);
  }
  
  @keyframes agrToright {
    0% {

    }
    100% {
      left: @list-width;
    }
  }
   .agr-to-right {
    .adv-animation(agrToright;.4s;1;forwards);
  }

  
  
</style>