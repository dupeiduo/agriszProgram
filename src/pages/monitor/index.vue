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
      :addTileAreas="{code: code, areas: tree, extent: bounds}"
      :maxZoom="12" ref="map"
      :useTools="true"></my-map>
    <div class="m-left-tab"
      :style="{width: leftLoading ? '358px' : '0'}"
      v-loading.lock="leftLoading">
      <left-tab 
        :showList="showList"
        @toggleList="toggleListStatus"
        :leftTab="[]"
        :title="'产品列表'"
        listTitle="返回查看所有监测产品"
        :backList="backList"
        @changeState="switchList">

        <v-list slot="list" 
          :list="list" 
          :curIndex="curIndex"
          @listChange="changeIndex"></v-list>

        <div slot="detail">
          <div class="crop-test">
            <div class="clear">
              <h3 class="crop-test-titile fl">{{listTitle}}</h3>
              <div @click.stop="hideTree">
                  <v-time @click.native="stopEvent"
                    :curDate="curDate" 
                    :showPop="showTime"
                    :startDate="new Date('2010-01-01')"
                    @showPanel="showTime = true"
                    @changeDate="changeDate"></v-time>
              </div>
            </div>
            <p class="crop-introduce">{{misc}}</p>
          </div>
          <div class="detail-height">
            <div class="tree-bg" @click.stop="hideTree" >
              <div class="tree-position pr">
                <input class="tree-input" type="text" readonly
                  @click="toggleTree"
                  :value="treeNodeName">
                <el-tree class="tree" 
                  v-if="showTree" 
                  highlight-current
                  :data="tree" 
                  :props="defaultProps" 
                  @node-click="treeNodeClick">
                </el-tree>
                
                <span @click="toggleTree" class="el-icon-arrow-down ps tree-icon"></span>

                <div v-if="showTree" class="confirm-btn-con">
                  <span @click="toggleTree" class="confirm-btn">确&nbsp;&nbsp;定</span>
                </div>
              </div>
              <template v-if="isGrow">
                <el-radio-group v-model="yearLabel"  @change="changeYear">
                  <el-radio :disabled="noLayer" class="radio" label="1" v-model="yearLabel"
                 >近一年</el-radio>
                  <el-radio :disabled="noLayer" class="radio" label="5" v-model="yearLabel" 
                  >近五年</el-radio>
                </el-radio-group>
              </template>
              <div class="block slider-container pr classify-slider">
                <opacity-ctl 
                    :useable="noLayer"
                    :opacity="opacity"
                    @changeOpacity="changeOpacity"
                    :title="opactlTitle"
                  ></opacity-ctl>
              </div>
            </div>
            <div class="check-data">
              <h3 class="check-data-title">数据查看</h3>
                <p class="check-data-section">通过对数据不同方面的查看，来更加深入的了解{{isGrow ? '作物长势' : '旱情'}}的综合情况。</p>
            </div>
            <div class="m-select-list">
              <ul>
                <li v-if="isGrow">
                  <img src="static/assets/img/monitor/line.png" class="fl">
                  <div class="m-list-right fl">
                    <p class="list-chart">
                      作物长势变化图
                      <span :disabled="noLayer" class="popupctl-btn"
                        @click="echartVisible = true, chartType='line'">查看折线图</span>
                    </p>
                    <p class="list-section" v-limitLine>{{lineSection}}
                    </p>
                  </div>
                </li>
                <li>
                  <img src="static/assets/img/monitor/bar.png" class="fl">
                  <div class="m-list-right fl">
                    <p class="list-chart">
                      {{isGrow ? '作物长势' : '旱情'}}分级统计图
                      <span :disabled="noLayer" class="popupctl-btn"
                        @click="echartVisible = true, chartType='bar'">查看柱状图</span>
                    </p>
                    <p class="list-section" v-limitLine>{{barSection}}
                    </p>
                  </div>
                </li>
                <li>
                  <img src="static/assets/img/monitor/report.png" class="fl">
                  <div class="m-list-right fl">
                    <p class="list-chart">
                      {{reportSection}}
                      <span class="popupctl-btn" @click="loadReport">查看报告</span>
                    </p>
                    <p class="list-section" v-limitLine>{{listSection}}</p>
                  </div>
                </li>
              </ul>
          </div>
          </div>
        </div>
      </left-tab>
    </div>
      
    <my-dialog v-show="echartVisible"
      v-loading.body="chartLoading"
      class="dialog-bg"
      :titlePadding="'15px 0px 0px 18px'"
      @close="echartVisible = false">
      <el-tooltip slot="title" class="chart-title" effect="light" :content="chartTip" placement="right-start" popper-class="tips-popover">
        <p class="chart-title-p no-select">
          {{chartTitle}}
          <span class="help"><i class="chart-tip no-select">?</i></span>
        </p>
      </el-tooltip>
      <my-echart slot="content" class="echart" :options="echartData" :width="'600px;'" :height="'36px;'"></my-echart>
    </my-dialog>

    <date-selector class="date-selector no-select"
      v-loading.body="dlLoading"
      :start="startDate"
      :end="new Date()"
      :date="curDate"
      :dlData="dlData" 
      @changeDate="changeDate">
    </date-selector>
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

    <no-data :noLayer="noLayer"></no-data>

    <my-searchpoi right="134px" :map="map" @setCenter="setCenter"></my-searchpoi>
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
  import dateSelector from './dateSelector'
  import viewreport from 'components/viewReport';
  import reportlist from 'components/reportList';
  import format from 'api/model.js';
  import noData from 'components/noData';
  export default{
    data(){
      return {
        map: null,
        leftLoading: false,
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
        homeIndex: null,
        treeNodeName: '',
        showTree: false,
        tree: [],
        defaultProps: {
          children: 'contain',
          label: 'area_name'
        },
        code: null,
        bounds: [],
        isOneYear: true,
        yearLabel: "1",
        isGrow: true,
        opacity: 90,
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
        showLegend: false,
      }
  },
  created() {
    this.leftLoading = true
    this.dlLoading = true
    axios.all([request.cantonTree(), request.productList()])
    .then(axios.spread((treeData, listData) => {
      if (treeData.status === 200 && treeData.data.length > 0) {
        this.tree = treeData.data;
        this.code = treeData.data[0].area_id
        this.treeNodeName = treeData.data[0].area_name
        this.bounds = model.formatBounds(treeData.data[0])
      } else {
        this.setNoLayer()
      }

      if (listData.data && listData.data.length > 0) {
        this.list = listData.data;
        this.curIndex = this.homeIndex ? this.homeIndex : 0
      } else {
        this.setNoLayer()
      }
      this.leftLoading = false
      this.showLegend = true
    }));
  },
  methods: {
    changeOpacity(value) {
      this.opacity = value
      if (this.layer && typeof value ==="number") {
        this.layer.setOpacity(value/100)
      }
    },
    toggleListStatus(isShow) {
      this.showList = isShow;
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
    },
    setCenter() {
      this.$refs['map'].setCenter()
    },
    hideTree() {
      this.showTree = false
      this.showTime = false
    },
    stopEvent(event) {
      event.stopPropagation()
    },
    toggleTree() {
      event.stopPropagation()
      this.showTree = !this.showTree
      console.log(this.showTree)
    },
    treeNodeClick(data) {
      this.bounds = model.formatBounds(data)
      this.code = data.area_id
      this.treeNodeName = data.area_name
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
      // 底层实现
      var dateStr = dateUtil.formatDate(date)
      this.curDate = new Date(dateStr)

      for (var i = this.dlData.data.length - 1; i >= 0; i--) {
        if (dateStr === this.dlData.data[i].date) {
          if (this.dlData.data[i].hasData) {
            this.noLayer = false
            var key = this.list[this.curIndex].product_key
            key += this.isGrow ? (this.isOneYear ? '-1' : '-5') : ''
            this.layer = this.addLayerByDate(key, date)
          } else {
            this.setNoLayer()
          }
          break
        }
      }
    },
    getRecent() {
      if (this.code && this.curIndex >= 0) {
        var key = this.list[this.curIndex].product_key
        key += this.isGrow ? (this.isOneYear ? '-1' : '-5') : ''
        var start = this.startDate.getFullYear(),
          end = new Date().getFullYear();
        this.dlLoading = true
        this.noLayer = false
        request.latestProduct(key, this.code).then((response) => {
          var _year = new Date().getFullYear(),
            _period = '1'
          this.dlLoading = false
          if (response.status === 200 && response.data.status === 0) {
            response = response.data;
            _year = response.data.year;
            _period = response.data.tenday;

            this.curDate = dateUtil.periodToDate(_year + _period);
            this.layer = this.addLayerByDate(key, this.curDate)
            this.hasProduct(key, this.code, start, end)
          } else {
            this.setNoLayer()
            this.curDate = new Date()
            this.dlData = model.formatDLData(null, start, end)
          }
        })
      }
    },
    setNoLayer() {
      this.noLayer = true
      if (this.layer) {
        this.map.removeLayer(this.layer)
        this.layer = null
      }
    },
    hasProduct(key, code, start, end) {
      this.dlLoading = true
      request.existProduct(key, code, start, end).then((response) => {
        if (response.status === 200 && response.data.status === 0) {
          this.dlData = model.formatDLData(response.data.data, start, end)
        } else {
          this.dlData = model.formatDLData(null, start, end)
        }
        this.dlLoading = false
      })
    },
    addLayerByDate(key, date) {
      if (this.layer) {
        this.map.removeLayer(this.layer)
      }
      
      var extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857")),
        url = `${key}/${date.getFullYear()}/${key}_${date.getFullYear()}${dateUtil.dateToPeriod(date)}_FARMLANDMASK.${this.code}_GRADE`
      url = config.tileMapUrl + url
      var layer = this.$refs['map'].addXYZLayer(url, extent, this.map)
      layer.setOpacity(this.opacity/100)
      return layer

      function getRasterSld(layerName, legend) {
        var colorList;
        for (var key in legend) {
          if (key == '0') {
            colorList += '<ColorMapEntry color="' +
              legend[key].color + '" quantity="' + key +
              '" label="' + legend[key].name +
              '" opacity="0" />';
          } else {
            colorList += '<ColorMapEntry color="' +
              legend[key].color + '" quantity="' + key +
              '" label="' + legend[key].name +
              '" opacity="1" />';
          }
        }
        var sld = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">' +
          '<NamedLayer>' +
          '<Name>' + layerName + '</Name>' +
          '<UserStyle>' +
          '<Title>SLD Cook Book: Discrete colors</Title>' +
          '<FeatureTypeStyle>' +
          '<Rule>' +
          '<RasterSymbolizer>' +
          '<ColorMap extended="true" type="values">' +
          colorList +
          '</ColorMap>' +
          '</RasterSymbolizer>' +
          '</Rule>' +
          '</FeatureTypeStyle>' +
          '</UserStyle>' +
          '</NamedLayer>' +
          '</StyledLayerDescriptor>';
        return sld;
      }
    },
    lineChart(key) {
      var end = (new Date()).getFullYear().toString(),
        url = `${key}/${this.code}/${end}/9`,
        startDate = new Date(`${(end - 9)}-01-01`),
        options = {
          url: url,
          startDate: startDate,
          endDate: new Date()
        }
      request.lineData(options).then((response) => {
        response = response.data;
        if (response && response.status == '0') {
          var formated = model.formatMonitorLine(response, options);
          this.echartData = charts.getLine(formated);
        } else {
          this.echartData = {}
        }
        this.chartLoading = false
      });
    },
    barChart(key) {
      var end = dateUtil.formatDate(new Date()),
        startDate = new Date('2010-01-01'),
        startStr = dateUtil.formatDate(startDate),
        url =  `${key}/${this.code}/${startStr}/${end}`,
        options = {
          url: url,
          legend: this.legend,
          startDate: startDate,
          endDate: new Date()
        }
      request.barData(options).then((response) => {
        response = response.data;
        if (response && response.status == '0') {
          var formated = model.formatMonitorBar(response, options);
          this.echartData = charts.getBar(formated);
        } else {
          this.echartData = {}
        }
        this.chartLoading = false
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
      this.getRecent()
      this.setChartTip(index)
      this.getAllTitle()
    },
    chartType: function(chartType) {
      this.chartLoading = true
      this.echartData = null
      var key = this.list[this.curIndex].product_key

      if (chartType == 'line') {
        this.lineChart(key);
      } else if (chartType == 'bar') {
        key += this.isGrow ? (this.isOneYear ? '-1' : '-5') : ''
        this.barChart(key)
      } else {
        return
      }
      var chartTipObj = JSON.parse(this.list[this.curIndex].product_detail.toString().replaceAll("'",'"'));
      this.chartTitle = chartTipObj[key].title
      this.chartTip = chartTipObj[key].help
    },
    isOneYear: function(isOneYear) {
      this.chartType = ''
      var productType = this.list[this.curIndex].product_key
      productType += this.isGrow ? (isOneYear ? '-1' : '-5') : ''
      if (!this.noLayer) {
        this.layer = this.addLayerByDate(productType, this.curDate)
        this.$refs['popMessage'].showDialog()
        this.popTitle = isOneYear ? '地图已切换至与近一年长势对比' : '地图已切换至与近五年长势对比'

        this.setChartTip(this.curIndex)
      }
        
    },
    code: function (code) {
      this.getRecent()
    },
    $route: {
      handler: function({query}) {
        if (query.index) {
          this.homeIndex = Number(query.index)
        }
      },
      immediate: true
    }
  },
  beforeDestroy(){
    this.map.removeLayer(this.layer)
    this.homeIndex = null
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
    noData
  }
}
</script>

<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  @import '../../assets/style/reset';
  .detail-height {
    @media screen and (max-height: 830px) {
      height: 395px;
      overflow: scroll;
    }
    @media screen and (max-height: 678px) {
      height: 324px;
      overflow: scroll;
    }
  }
  .m-left-tab {
    position: fixed;
    top: 80px;
    left: 10px;
    z-index: 1;
    height: 550px;
  }
  .e-chart {
    position: absolute;
    top: 175px;
    background: #fff;
    width: 318px;
    border-radius: 2px;
    text-align: left;
    .mixin-boxshadow();
    
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
      .mixin-border(#898989;4px);
      em {
        margin-left: 2px;
      }
    }
  } 
  .echart {
    width: 700px;
    height: 400px;
  }
  .chart-title {
    width: 30%;
    font-size: 14px;
    font-weight: 600;
    color: #6ea363;
      .chart-title-p {
        font-size: 16px;
        .help {
          height: 18px;
          background: #fff;
          display: inline-block;
          cursor: pointer;
          color: #bbbec2;
          margin: 0 10px;
          font-size: 15px;
          .mixin-width(18px);
          .mixin-border(#bbbec2;16px);

        }
      }
    .chart-title-p {
      color: #7e6139;
    }
  }
  .date-selector {
    width: 98%;
    height: 42px;
    position: fixed;
    bottom: 8px;
    left: 1%;
    border-radius: 4px;
    overflow: hidden;
  }
  .crop-test {
    padding: 0px 14px;
    background: #9fd032;
    .crop-test-titile {
      font-size: 16px;
      margin: 12px 0 4px 0;
      font-weight: bold;
      color: #fff;
    }
    .crop-introduce {
        color: #fff;
        line-height: 22px;
        padding-bottom: 14px;
      }
  }
  .tree-bg {
    padding: 20px 14px 0px;
    background: #f2fee7;
    border-bottom: 1px solid #cdd0d2;
    .el-switch {
      line-height: 1em;
      margin: 14px 0 8px;
    }
    .confirm-btn-con {
      position: absolute;
      width: 328px;
      height: 50px;
      background: #fff;
      top: 202px;
      left: 1px;
      z-index: 10002;
      .mixin-boxshadow();
    } 
  }
  .check-data {
    padding: 0px 14px 14px;
    .check-data-title {
      margin: 12px 0 6px;
      font-size: 16px;
    }
    .check-data-section {
      margin: 0 20px;
      line-height: 22px;
      color: #272727;
    }
  }
  .m-select-list {
    margin: 0 14px 10px;
    padding-bottom: 10px;
    li {
      margin: 0 8px;
      clear: both;
      overflow: hidden;
      border-top: 1px dashed #d5d5d5;
      border-bottom: 1px dashed #d5d5d5;
      img {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        margin: 16px 0 0 10px;
      }
      .m-list-right {
        width: 228px;
        margin: 0 0 10px 15px;
        .list-chart {
          position: relative;
          font-size: 14px;
          margin-top: 6px;
          .popupctl-btn {
            position: absolute;
            width: 70px;
            right: 4px;
            height: 25px;
            line-height: 25px;
            font-size: 13px;
            text-align: center;
            background: #a2d245;
            border: 1px solid #a2d245;
            cursor: pointer;
            padding: 0 4px;
            .mixin-common-border();
            &:hover{
              background: #cadc76;
            }
          }
        }
        .list-section {
          line-height: 22px;
          color: #a4a4a4;
        }
      }
      &:last-child {
        border-bottom: none;
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
</style>