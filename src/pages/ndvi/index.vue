<template>
  <div class="ndvi" @click="hidePopup">
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
    <div class="n-left-tab"
      :style="{width: leftLoading ? '358px' : '0'}"
      v-loading.lock="leftLoading">
      <left-tab
        :showList="showList"
        @toggleList="toggleListStatus"
        :leftTab="[]"
        listTitle="返回高精度NDVI产品"
        :backList="backList"
        @changeState="switchList">
        
        <div slot="list" class="desc-list">
          <div class="desc-bg">
            <h3 class="desc-list-title">高精度NDVI产品</h3>
            <p class="desc-list-section">使用先进的技术手段解析高分辨率的卫星遥感图像，能够高度精准地展现农作物生长状态。</p>
          </div>
          
          <div @click.stop="hidePopup">
            <ndvi-date
              @showPopEvt="showPopEvt"
              :curDate="curDate"
              :showPop="showDatePop"
              :startDate="startDate"
              @changeDate="changeDate"
              :exist="dateArray"></ndvi-date>
          </div>
            

          <div class="ndvi-ctl slider-container pr plant-slider">
            <opacity-ctl 
                :opacity="opacity"
                @changeOpacity="changeOpacity"
                :title="opactlTitle"
              ></opacity-ctl>
          </div>
          <div class="opreat-btn clear">
            <span @click="ndviMeasure"><i class="iconfont icon-celiang"></i>NDVI测量</span>
            <span @click="landInfo"><i class="iconfont icon-dikuai"></i>地块信息</span>
          </div>
          <h3 class="trend-title">{{chartTitle}}</h3>
          <div class="line-chart-bg">
            <my-echart class="line-chart" v-loading.lock="lineChartLoading"
            :options="lineChart"></my-echart>
          </div>
        </div>
        
        <div slot="detail" v-show="ndviMeas" class="ndvi-measure">
          <h3 class="measure-title font14">NDVI测量</h3>

          <div @click.stop="hidePopup">
            <ndvi-date
              @showPopEvt="showPopEvt"
              :showPop="showDatePop"
              :curDate="curDate"
              :startDate="startDate"
              @changeDate="changeDate"
              :exist="dateArray"></ndvi-date>
          </div>

          <div class="ndvi-ctl slider-container pr plant-slider">
            <opacity-ctl 
                :opacity="opacity"
                @changeOpacity="changeOpacity"
                :title="opactlTitle"
              ></opacity-ctl>
          </div>
          <h3 class="trend-title">测量方式</h3>
          <div class="measure-btn clear no-select">
            <span @click="measurePoint" :class="this.curType === 'point' ? 'active' : ''">点测量</span>
            <span @click="measureArea" :class="this.curType === 'polygon' ? 'active' : ''">面测量</span>
            <span @click="measureLand" :class="this.curType === 'farmland' ? 'active' : ''">测量地块</span>
          </div>

          <div class="pr select-position">
            <h3 class="show-modal" v-if="showModal"><i class="iconfont icon-dianjitubiao" ></i>{{operatHelp}}</h3>
            <h3 class="start-measure" v-else><i class="iconfont icon-dianjitubiao" ></i>{{operatHelp}}</h3>
            <h3 class="trend-title">{{chartTitle}}
              <el-select placeholder="当前地块" class="hm-selector ps" 
                v-if="curType === 'farmland'" 
                v-model="value" 
                @change="changeLandType()">
                <el-option
                  v-for="item in trendOptions"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </h3>
            <p v-if="curType === 'point' && !showModal" class="land-detail">
              <span>地块类型: {{landTypeStr}}</span>
              <span>海拔: {{altitude}} 米</span>
            </p>
            <p v-else-if="curType === 'polygon' && !showModal" class="land-detail">
              <span>面积: {{polygonArea}}亩</span>
            </p>
            <p v-else-if="curType === 'farmland' && !showModal" class="land-detail">
              <span>地块面积: {{landArea}}亩</span>
            </p>
            <p v-else class="land-detail"> </p>
          </div>
          <div class="line-chart-bg">
            <my-echart class="line-chart" v-loading.lock="lineChartLoading"
              :options="lineChart"></my-echart>
          </div>
        </div>

        <div slot="detail" v-show="!ndviMeas" class="land-info tb-detail">
          <h3 class="measure-title font14 pr">地块类型面积图 
            <span class="down-table ps" @click="dlNDVIArea">
              <i class="iconfont icon-xiazai1"></i>下载表格
            </span>
          </h3>
          <my-echart class="bar-chart"
            :options="barChart"></my-echart>
          <el-table
            :data="landTypeData"
            style="width: 100%">
            <el-table-column
              prop="landType"
              label="地块类型"
              width="100">
            </el-table-column>
            <el-table-column
              prop="value"
              label="面积（亩）"
              width="100">
            </el-table-column>
            <el-table-column
              prop="percent"
              label="占比">
            </el-table-column>
            <el-table-column
              width="70"
              label="选择">
              <template scope="scope">
                <el-button @click="visibleCtl(scope.row.show, scope.$index)" type="text" size="small">
                <i class="iconfont eye-ctl" 
                  :class="scope.row.show ? 'icon-eye' : 'icon-hide'"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </left-tab>
    </div>
      
    <div v-if="showLegend" class="legend-con">
      好<p><i class="legend"></i><i class="legend-bottom"></i></p>差
    </div>
    <div id="popup" title="土地确权信息"></div>
    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
    <my-searchpoi right="134px" :map="map" @setCenter="setCenter"></my-searchpoi>
  </div>
</template>

<script>
import request from 'api/request.js'
import model from 'api/model.js'
import leftTab from 'components/leftTab'
import ndviTime from './time/'
import ndviDate from './date/'
import {dateUtil} from 'plugins/utils.js'
import chartCtl from './echart'
import mapCtl from './map'
import configData from '../../config/data.js'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      chartTitle: '全区NDVI历史走势',
      map: null,
      landLayer: null,

      opactlTitle: '图层透明度',
      opacity: 100,

      showList: true,
      backList: false,
      title: '高精度NDVI产品',
      ndviMeas: false,
      dateArray: [],
      curDate: new Date(),

      operatHelp: '请选择测量方式',
      curType: '',

      leftLoading: false,
      lineChartLoading: false,
      lineChartCache: null,
      lineChart: null,
      barChart: null,
      landTypeData: [],
      landType: 0,
      areaName: '',
      satelLite: '',
      landDate: '',
      value: '',
      isChange: true,
      trendOptions: [],
      altitude: 0,  // 经纬度
      landTypeStr: '',  //地块类型
      polygonArea: 0,  // 多边形面积
      landArea: 0, // 地块面积
      dataList: [],
      layerName: '',

      hideList: [],
      startDate: new Date("2010-01-01"),
      endDate: new Date(),
      popTitle: '',
      showModal: true,
      drawing: false,

      showDatePop: false,
      showLegend: false
    }
  },
  mounted() {
    this.areaName = configData.NDVI.areaName
    this.satelLite = configData.NDVI.satelLite
    this.landDate = configData.NDVI.landDate

    this.getAllNdvi()
    this.$on("selectLand", this.setLandPostData)
    this.$on("unselectLand", this.getAllNdvi)
    this.$on('setPostData', this.setPostData)
    vueBus.$on('mapDrawHandler', this.mapDrawHandler)
  },
  methods: {
    hidePopup() {
      this.showDatePop = false
    },
    showPopEvt(show) {
      this.showDatePop = show
    },
    initMap (map) {
      this.map = map;
      this.setCenter()
      this.areaName = configData.NDVI.areaName
      this.addGeom()
    },
    setCenter() {
      this.$refs['map'].setCenter()
    },
    toggleListStatus(isShow) {
      this.showList = isShow;
    },
    switchList(topicId) {
      this.backList = !this.backList; 
      if (this.landLayer && typeof value ==="number") {
        this.landLayer.setOpacity(value/100)
      }
    },
    mapDrawHandler({maptool, ndvi}) {
      this.curType = ''
      this.showModal = true
      this.operatHelp = '请选择测量方式'
      this.chartTitle = '全区NDVI历史走势'

      if(maptool) {
        mapCtl.removeDrawInteraction(true)
      } 
      else if (!ndvi) {
        mapCtl.addDrawInteraction('')
      }
    },
    changeOpacity(value) {
      this.opacity = value
      if (this.ndviLayer) {
        this.ndviLayer.setOpacity(value/100)
      }
    },
    ndviMeasure() {
      this.ndviMeas = true
      this.backList = true
    },
    landInfo() {
      this.ndviMeas = false
      this.backList = true
      if (!this.barChart) {
        this.getLandArea()
      }
    },
    measurePoint() {
      if (this.curType === 'point') {
        this.clearDrawing()
      } else {
        
        this.startDraw('point', '点击地图决定测量点')
      }
    },
    measureArea() {
      if (this.curType === 'polygon') {
        this.clearDrawing()
      } else {
        this.startDraw('polygon', '点击地图决定测量面')
      }
    },
    measureLand() {
      if (this.curType === 'farmland') {
        this.clearDrawing()
      } else {
        this.value = 0
        this.getLandArea()
        this.startDraw('farmland', '点击地图决定测量地块')
        
        this.$nextTick(() => {
          this.showModal = false
        })
      }
    },
    startDraw(type, tip) {
      vueBus.$emit('mapDrawHandler', {ndvi: true})
      this.$nextTick(() => {
        this.curType = type
        this.operatHelp = tip
        mapCtl.addDrawInteraction(this.curType)
      })
    },
    clearDrawing() {
      this.curType = ''
      this.showModal = true
      this.operatHelp = '请选择测量方式'
      this.chartTitle = '全区NDVI历史走势'
      mapCtl.addDrawInteraction('')
    },
    setPostData(geom) {
      switch(this.curType) {
        case "point": 
          this.chartTitle = '当前测量点NDVI历史走势'
          this.landTypeStr = geom.landType
          var postData = {
            "area_name": this.areaName,
            "satellite_name": this.satelLite,
            "point": geom.coordinate
          };
          this.getPointNDVIList(postData);
          this.getAltitude(geom.coordinate)
          break;
        case "polygon":
          this.chartTitle = '当前测量面NDVI历史走势'
          this.polygonArea = geom.area
          var postData = {
              "area_name": this.areaName,
              "satellite_name": this.satelLite,
              "polygon": geom.coordinate
          };
          this.getAreaNDVIList(postData);
          break;
        case "farmland":
          this.chartTitle = '当前地块NDVI历史走势'
          break
      }
    },
    setLandPostData(geoInfo) {
      this.value = ''
      this.chartTitle = '当前地块NDVI历史走势'
      this.landArea = geoInfo.landArea
      var postData = {
          "area_name": this.areaName, 
          "satellite_name": this.satelLite,
          "object_id": geoInfo.objectId
      };
      this.getLandNDVIList(postData);
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
      if (dateInfo.layerName) {
        this.addNDVIlayer(dateInfo.layerName)
      }
    },
    visibleCtl(show, index) {
      this.landTypeData[index].show = !show

      var landTypeId = this.landTypeData[index].id
      var list = this.getVisibleList(landTypeId, show)
      
      mapCtl.hideLayer(list)
      this.addNDVIlayer(this.layerName, list)
    },
    getVisibleList(typeId, show) {
      if (show) {
        this.hideList.push(typeId)
      } else {
        var index = this.hideList.indexOf(typeId)
        this.hideList.splice(index, 1)
      }
      return this.hideList
    },
    changeLandType() {
      if (this.value !== "") {
        this.landType = this.trendOptions[this.value].value
        this.landArea = 0
        
        var postData = {
            "area_name": this.areaName,
            "land_type": this.landType, 
            "satellite_name": this.satelLite
        };
        this.getLandNDVIList(postData);
        this.getLandArea()
        this.addNDVIlayer(this.layerName)
        mapCtl.addDrawInteraction('')
        mapCtl.highLightFeature(this.landType)
      }
    },
    getAltitude(coordinate) {
      var lonlat = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')
      if (this.altitudeReqHandler) {
        this.altitudeReqHandler.cancelRequest("cancel request")
        this.altitudeReqHandler = null
      }

      this.altitudeReqHandler = request.pointAltitude(lonlat)
      this.altitudeReqHandler.then((response)=> {
        this.altitudeReqHandler = null
        if (response && response.status === 200 && response.data.status === 0) {
          this.altitude = response.data.data.altitude
        }
      })
    },
    getPointNDVIList(postData) {
      if (this.pointReqHandler) {
        this.pointReqHandler.cancelRequest("cancel request")
        this.pointReqHandler = null
      }

      this.lineChartLoading = true
      this.pointReqHandler = request.getHistoryPoiNdvi(postData)

      this.pointReqHandler.then((response) => {
        this.pointReqHandler = null
        if (response && response.status === 200 && response.data.status === 0) {
          this.lineChart = null
          var formated = model.formatLine4Ndvi(response.data.data)
          this.lineChart = chartCtl.allLine(formated)
        } else {
          console.log("We don't have this point info")
        }
        this.showModal = false
        this.lineChartLoading = false
      })
    },
    getAreaNDVIList(postData) {
      if (this.areaReqHandler) {
        this.areaReqHandler.cancelRequest("cancel request")
        this.areaReqHandler = null
      }

      this.lineChartLoading = true
      this.areaReqHandler = request.getHistoryAreaNdvi(postData)
      this.areaReqHandler.then((response) => {
        this.areaReqHandler = null
        if (response && response.status === 200 && response.data.status === 0) {
          var formated = model.formatLine4Ndvi(response.data.data)
          this.lineChart = null
          this.lineChart = chartCtl.allLine(formated)
        } else {
          console.log("We don't have this point info")
        }
        this.showModal = false
        this.lineChartLoading = false
      })
    },
    getLandNDVIList(postData) {
      if (this.lanReqHandler) {
        this.lanReqHandler.cancelRequest("cancel request")
        this.lanReqHandler = null
      }

      this.lineChartLoading = true
      this.lanReqHandler = request.getAllNdviValue(postData)
      this.lanReqHandler.then((response) => {
        this.lanReqHandler = null
        if (response && response.status === 200 && response.data.status === 0) {
          var formated = model.formatLine4Ndvi(response.data.data)
          this.lineChartCache = this.lineChartCache 
                                ? this.lineChartCache 
                                : chartCtl.allLine(formated)
          this.lineChart = null
          this.lineChart = chartCtl.allLine(formated)
        } else {
          console.log("We don't have all ndvi data")
        }
        this.lineChartLoading = false
      })
    },
    setCenter() {
      var view = this.map.getView(),
        zoomLev = configData.NDVI.zoomLevel,
        coordinates = configData.NDVI.coordinates
      view.setZoom(zoomLev)
      view.setCenter(coordinates)
    },
    addGeom() {
      var data = {
        data: [{ "area_name": this.areaName  }]
      }

      request.landGeom(data).then((response) => {
        if (response.status === 200 && response.data.status === 0) {
          this.dataList = response.data.data[this.areaName]
          mapCtl.addVectorLayer(this.dataList, this)
          mapCtl.addDrawInteraction('')
          this.getAllNdviInfo()
        }
      })
    },
    getAllNdvi() {
      this.chartTitle = '全区NDVI历史走势'
        
      if (this.lineChartCache) {
        this.lineChart = null
        this.lineChart = this.lineChartCache
      } else {
        var data = {
          area_name: this.areaName,
          satellite_name: this.satelLite,
          land_type: this.landType
        }
        this.getLandNDVIList(data)
      }
    },
    getLandArea() {
      if (this.landTypeData.length === 0) {
        var data = {
          date: this.landDate,
          area_name: this.areaName
        }
        this.leftLoading = true
        request.lanTypeArea(data).then((response) => {
          if (response.status === 200 && response.data.status === 0) {
            var formated = model.formatLandArea(response.data.data.type_list)
            this.landTypeData = formated.tbData
            this.trendOptions = formated.typeInfo
            this.barChart = chartCtl.landPie(formated.pieData)
            this.setLandTypeArea()
          } else {
            console.log("We don't have all land type area data")
          }
          this.leftLoading = false
        })
      } else {
        this.setLandTypeArea()
      }
    },
    setLandTypeArea() {
      for (var i = 0; i < this.landTypeData.length; i++) {
        if (this.value == this.landTypeData[i].id) {
          this.landArea = this.landTypeData[i].value
          break
        }
      }
    },
    getAllNdviInfo() {
      var data = {
        area_name: this.areaName,
        satellite_name: this.satelLite
      }
      this.leftLoading = true
      request.getAllNdviInfo(data).then((response) => {
        if (response.status === 200 && response.data.status === 0) {
          var formated = model.formatNdviInfo(response.data.data)
          this.dateArray = formated
          this.addNDVIlayer(formated[formated.length - 1].layerName)
        } else {
          console.log("We don't have all land type area data")
        }
        this.leftLoading = false
        this.showLegend = true
      })
    },
    addNDVIlayer(layerName, filter) {
      if (this.ndviLayer) {
        this.map.removeLayer(this.ndviLayer)
      }
      this.layerName = layerName

      this.ndviLayer = mapCtl.getNDVIlayer(layerName)
      this.map.addLayer(this.ndviLayer)


      var style = mapCtl.getClipStyle()
      var features = mapCtl.getVectorFeatures(this.dataList, this.landType, filter)
      mapCtl.clipLayer(this.ndviLayer, features, style)
    },
    dlNDVIArea() {
      var options = {
        fileName: '地块类型面积信息',
        date: this.landDate,
        areaName: this.areaName
      }
      request.downLoadNDVIArea(options)
    }
  },
  watch: {
    backList(toList) {
      if (!toList) {
        this.clearDrawing()
      }
    }
  },
  components: {
    leftTab,
    ndviTime,
    ndviDate
  }
}
</script>

<style 
  lang="less" 
  scoped>
@import '../../assets/style/reset';
  .ndvi {
    
    .ndvi-date-title {
      position: relative;
      left: 10px;
    }
    .date-ctl-con {
      margin: 10px;
    }
    .n-left-tab {
      position: fixed;
      top: 57px;
      left: 10px;
      z-index: 1;
      height: 518px;
      border-radius: 4px;
    }
    .ndvi-ctl {
        margin-left: 18px;
      }
    .trend-title {
        position: relative;
        line-height: 40px;
        padding-left: 18px;
        font-size: 14px;
        border-top: 1px solid #e5e5e5;
        .hm-selector {
          position: absolute;
          top: 9px;
          right: 16px;
          width: 75px;
        }
    }
    .measure-title {
        padding-left: 16px;
        color: #fff;
        background: #9ed132;
        .mixin-height(40px);
        .down-table {
          font-size: 12px;
          top: 6px;
          right: 12px;
          color: #548d39;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-weight: normal;
          .mixin-height(26px);
          .mixin-width(84px);
          i {
            font-size: 12px;
            margin-right: 4px;
          }
          &:hover {
            background: #eee;
            font-weight: bold;
          }
        }
      }
    .line-chart-bg {
        width: 334px;
        height: 228px;
        margin: 0 auto;
        background: #fafafa;
        .mixin-border(#d6d6d6;4px);
        .line-chart {
          width: 334px;
          height: 228px;
        }
      }
    .desc-list {
      padding-bottom: 10px;
      .desc-bg {
        padding: 20px 17px 16px;
        background: #9ed132;
        border-radius: 4px 0 0 0;
        .desc-list-title {
          line-height: 1em;
          font-size: 16px;
          color: #fff;
         }
        .desc-list-section{
          line-height: 20px;
          margin-top: 12px;
          color: #fff;
        }
      }
      .opreat-btn {
        background: #f3fbeb;
        .mixin-border(#bed7b5;4px);
        margin: 0px 12px 10px;
        cursor: pointer;
        color: #708c69;
        span {
          float: left;
          position: relative;
          padding: 0 46px;
          .mixin-height(34px);
            i {
              margin-right: 8px;
             }
            &:hover {
              background: #cde791;
              color: #255921;
            }
            &:first-child:after {
            position: absolute;
            right: 0;
            top: 4px;
            content: '';
            height: 28px;
            width: 1px;
            background: #bed7b5;
          }
        }
      }
    }
    .ndvi-measure {
      padding-bottom: 14px;
      .measure-btn {
        background: #f2faea;
        color: #708c69;
        border-top: 1px solid #bed7b5;
        border-bottom: 1px solid #bed7b5;
        .active, .active:hover {
          background: #cde791;
          color: #255921;
        }
        span {
          position: relative;
          float: left;
          padding: 0 40px 0 39px;
          .mixin-height(36px);
          cursor: pointer;
          &:first-child:after, &:nth-child(2):after {
            position: absolute;
            right: 0;
            top: 4px;
            content: '';
            height: 28px;
            width: 1px;
            background: #bed7b5;
          }
          &:hover {
            background: #fbfff5;
          }
        }
      }
      .select-position {
          .show-modal {
            top: 0px;
            z-index: 2;
            width: 100%;
            position: absolute;
            color: #edb618;
            text-align: center;
            cursor: default;
            background: rgba(0,0,0,.5);
            .mixin-height(52px);
        }
      }
      .start-measure {
        background: #f3f3f3;
        color: #edb618;
        text-align: center;
        cursor: default;
        .mixin-height(28px);
        i {
          position: relative;
          top: 2px;
          right: 1px;
        }
      }
      .land-detail {
        line-height: 1em;
        margin-bottom: 12px;
        padding-left: 18px;
        color: #292929;
        span {
          margin-right: 10px;
        }
      }
    }
    .land-info {
      padding-bottom: 30px;
      .bar-chart {
        width: 330px;
        height: 260px;
      }
      table {
        tr {
          td {
            .selected {
              color: #eee;
            }
          }
        }
      }
    }
    .legend-con {
      position: fixed;
      top: 210px;
      right: 12px;
      width: 32px;
      height: 200px;
      background: #fff;
      padding: 4px 0;
      border-radius: 4px;
      text-align: center;
      .mixin-boxshadow();
      p {
        width: 14px;
        margin: 3px 9px;
        .legend {
          display: block;
          height: 120px;
          background: linear-gradient(top,#076b0d,#298200,#93cc00,#cce600,#f3f600,#ffd000,#ff8a00,#ff7400,#ff3800,#ee2300,#de1f00,#9e1300);
          background: -o-linear-gradient(top, #076b0d,#298200,#93cc00,#cce600,#f3f600,#ffd000,#ff8a00,#ff7400,#ff3800,#ee2300,#de1f00,#9e1300);
          background: -moz-linear-gradient(top, #076b0d,#298200,#93cc00,#cce600,#f3f600,#ffd000,#ff8a00,#ff7400,#ff3800,#ee2300,#de1f00,#9e1300);
          background: -webkit-linear-gradient(top, #076b0d,#298200,#93cc00,#cce600,#f3f600,#ffd000,#ff8a00,#ff7400,#ff3800,#ee2300,#de1f00,#9e1300);
        }
       .legend-bottom {
          display: block;
          height: 40px;
          background: linear-gradient(top,#dbdcde,#babcbe,#8f9194,#383838);
          background: -o-linear-gradient(top,#dbdcde,#babcbe,#8f9194,#383838);
          background: -moz-linear-gradient(top,#dbdcde,#babcbe,#8f9194,#383838);
          background: -webkit-linear-gradient(top,#dbdcde,#babcbe,#8f9194,#383838);
       }
      }
    }
  }
</style>