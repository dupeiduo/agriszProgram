<template>
  <div @click="hideTree">
    <v-legend :legendData="legends"></v-legend>
    <my-map class="map" 
      @initMap="initMap" 
      background="#31c37c"
      :top="120"
      borderRadius="4px"
      :switchCtl="true"
      :centerCtl="{use: true, bounds: bounds}"
      :addTileAreas="{code: code, areas: tree}"
      :maxZoom="12" ref="map"></my-map>
    <div class="m-left-tab"
      :style="{width: leftLoading ? '323px' : '0'}"
      v-loading.body="leftLoading">
      <left-tab 
        :showList="showList"
        @toggleList="toggleListStatus"
        :leftTab="[]"
        :title="title"
        :backList="backList"
        @changeState="switchList">

        <v-list slot="list" 
          :list="list" 
          :curIndex="curIndex"
          @listChange="changeIndex"></v-list>

        <div slot="detail">
          <input class="tree-input" type="text" readonly
            @click.stop="hideTree" 
            @click="showTree = !showTree" 
            :value="treeNodeName">
          <el-tree class="tree" 
            v-if="showTree" 
            @click.stop="hideTree"
            :data="tree" 
            :props="defaultProps" 
            @node-click="treeNodeClick">
          </el-tree>

          <el-switch class="switch"
            :disabled="noLayer"
            v-if="isGrow"
            :width=76
            v-model="isOneYear"
            on-color="#58B7FF"
            off-color="#1D8CE0"
            on-text="近一年"
            off-text="近五年">
          </el-switch>
          <hr class="hr-control">
          <div class="block slider-container">
            <opacity-ctl 
                :useable="noLayer"
                :opacity="opacity"
                @changeOpacity="changeOpacity"
                ></opacity-ctl>
          </div>

          <div class="e-chart">
            <p>选择数据图</p>
            <hr>
            <button v-if="isGrow" :disabled="noLayer"
              @click="echartVisible = true, chartType='line'">
              折线图<em class="iconfont icon-iconfontcolor58"></em>
            </button>
            <button :disabled="noLayer"
              @click="echartVisible = true, chartType='bar'">
              柱状图<em class="iconfont icon-zhuzhuangtu"></em>
            </button>
          </div>
        </div>
      </left-tab>
    </div>
      
    <my-dialog v-show="echartVisible"
      v-loading.body="chartLoading"
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
    <viewreport @loadReport="loadReport" :reportName="reportName">
        <reportlist 
            slot="reportList"
            :reportContent="reportContent" 
            @scrollToBottom="scrollToBottom"
            :styleCtl="styleCtl"
            :clientH="clientH"
            >
       </reportlist>
    </viewreport>

    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
    <img v-if="noLayer" src="static/assets/img/common/no-data.png" width="215" class="no-data ps">
    <footer-lite></footer-lite>
  </div>
</template>

<script>
  import axios from 'axios'
  import vLegend from './legend/index';
  import leftTab from 'components/leftTab';
  import vList from './list'
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
  import footerLite from 'components/footerlite'

  export default{
    data(){
      return {
        leftLoading: false,
        dlLoading: false,
        chartLoading: false,
        curDate: new Date(),
        legends:[],
        legend: {},
        backList: true,
        title: "选择产品",
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
        isGrow: true,
        opacity: 100,
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
        reportName: '',
        clientH: 400,
        dlData: (function () {
          return {index: 0, data: [{hasData: false, date:'2010-01-01',period: "一月上旬"}]}
        })(),
        showList: true,
        noLayer: false,
        popTitle: ''
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
        this.noLayer = true
      }

      if (listData.data && listData.data.length > 0) {
        this.list = listData.data
        this.curIndex = this.homeIndex ? this.homeIndex : 0
      } else {
        this.noLayer = true
      }
      this.leftLoading = false
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
    scrollToBottom() {
      if (this.total && this.total <= this.perPage * this.currntPage) {
        return
      }
      this.currntPage += 1;
      this.getReportList(this.currntPage, this.perPage, this.section)
    },
    initMap (map) {
      this.map = map;
    },
    hideTree() {
      this.showTree = false
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
            this.noLayer = true
            this.map.removeLayer(this.layer)
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
            this.noLayer = true
          }
        })
      }
    },
    hasProduct(key, code, start, end) {
      this.dlLoading = true
      request.existProduct(key, code, start, end).then((response) => {
        if (response.status === 200 && response.data.status === 0) {
          this.dlData = model.formatDLData(response.data.data, start, end)
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
      this.title = this.list[this.curIndex].product_title;
    }
  },
  watch: {
    curIndex: function (index) {
      this.chartType = ''
      this.title = this.list[index].product_title;

      var key = this.list[this.curIndex].product_key
      this.isGrow = (configData.growTarget.name.indexOf(key) >= 0)
      this.legend = configData.productLegendConf[key]

      this.setLegend(this.legend)
      this.getRecent()
      if(this.isGrow){
        this.section = 'growing';
        this.reportName = '查看长势报告'
      }else {
        this.section = 'drought';
        this.reportName = '查看旱情报告'
      }
    },
    chartType: function(chartType) {
      this.chartLoading = true
      this.echartData = null
      var key = this.list[this.curIndex].product_key

      if (chartType == 'line') {
        this.lineChart(key)
      } else if (chartType == 'bar') {
        key += this.isGrow ? (this.isOneYear ? '-1' : '-5') : ''
        this.barChart(key)
      } else {
        return
      }
      // chart tips and title
      var chartTipObj = JSON.parse(this.list[this.curIndex].product_detail.toString().replaceAll("'",'"'));
      this.chartTitle = chartTipObj[key].title
      this.chartTip = chartTipObj[key].help
    },
    isOneYear: function(isOneYear) {
      this.chartType = ''
      var productType = this.list[this.curIndex].product_key
      productType += this.isGrow ? (isOneYear ? '-1' : '-5') : ''
      this.layer = this.addLayerByDate(productType, this.curDate)
      this.$refs['popMessage'].showDialog()
      this.popTitle = isOneYear ? '地图已切换至<近一年>' : '地图已切换至<近五年>'
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
  components: {
    vLegend,
    leftTab,
    dateSelector,
    vList,
    viewreport,
    reportlist,
    footerLite
  }
}
</script>

<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  .m-left-tab {
    position: fixed;
    min-height: 360px;
    left: 10px;
    top: 70px;
  }
  .switch {
    position: absolute;
    top: 60px;
    left: 227px;
    color: #333;
  }
  .hr-control {
    position: absolute;
    top: 90px;
    width: 100%;
    border-top: 0.1px #d2d2d2 solid;
  }
  .e-chart {
    position: absolute;
    top: 175px;
    background: #fff;
    width: 318px;
    border-radius: 2px;
    text-align: left;
    box-shadow: 0 2px 8px #aeaeae;
    
    p {
      margin: 5px 0 0 10px; 
    }
    hr {
      width: 100%;
      border-top: 0.1px #d2d2d2 solid;
    }
    button {
      line-height: 20px;
      display: inline-block;
      width: 78px;
      height: 26px;
      margin: 5px 5px 10px 10px;
      cursor: pointer;
      border: 1px solid #898989;
      border-radius: 4px;
      background: #e3e3e3;
      color: #2c3e50;
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
    font-size: 14px;
    font-weight: 600;
      .chart-title-p {
        font-size: 16px;
        .help {
          border-radius: 16px;
          border: 1px solid #bbbec2;
          width: 18px;
          height: 18px;
          background: #fff;
          display: inline-block;
          cursor: pointer;
          text-align: center;
          color: #bbbec2;
          margin: 0 10px;
          font-size: 15px;

        }
      }
    .chart-title-p {
      color: #7e6139;
    }
  }
  .date-selector {
    width: 98%;
    height: 106px;
    position: fixed;
    bottom: 20px;
    left: 1%;
    overflow: hidden;
  }
  .no-data {
    z-index: 2;
    top: 50%;
    left: 50%;
    margin-top: -45px;
    margin-left: -108px;
  }
</style>