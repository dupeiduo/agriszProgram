<template>
  <div @click="hidePop" class="scale-atbottom">
    <my-map class="map" 
      @initMap="initMap" 
      :switchCtl="true"
      background="#31c37c"
      :top="120"
      borderRadius="4px"
      :centerCtl="{use: true, bounds: bounds}"
      :addTileAreas="{code: code, areas: (showDcp ? dcpTree : tree)}"
      :maxZoom="14" ref="map"></my-map>
    <div class="c-left-tab" 
      :style="{width: leftLoading ? '323px' : '0'}"
      v-loading.body="leftLoading">
      <left-tab 
        :showList="showList"
        @toggleList="toggleListStatus"
        :leftTab="[]"
        :title="title"
        :backList="backList"
        @changeState="switchList">

        <left-list slot="list" 
          :list="list" 
          :options="options"
          :curIndex="curIndex"
          @getChartData="getChartData"
          @listChange="changeIndex"></left-list>

        <div v-if="haveCpDetail" slot="detail">
          <input class="tree-input" type="text" readonly 
            @click.stop="hidePop" 
            @click="showTree = !showTree" 
            :value="treeNodeName">
          <el-tree class="tree" 
            v-if="showTree" 
            @click.stop="hidePop"
            :data="tree" 
            :props="defaultProps" 
            @node-click="treeNodeClick">
          </el-tree>
          <hr class="hr-control">
          <div class="block slider-container">
            <opacity-ctl 
              :opacity="opacity"
              @changeOpacity="changeOpacity"
              ></opacity-ctl>
          </div>

          <div class="detail-container">
            <div class="tb-detail">
              <el-table v-if="tableData.length > 0"
                :stripe="true"
                :data="tableData"
                style="width: 100%">
                <el-table-column label="作物" width="60">
                  <template  scope="scope">
                    <span class="iconfont" :class="icons[scope.row.id]"></span>
                    {{scope.row.name}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="area"
                  label="种植面积"
                  width="150">
                </el-table-column>
                <el-table-column label="图例" width="60">
                  <template  scope="scope">
                    <span class="selcolor"
                      @click.stop="hidePop"
                      :style="{background: scope.row.color}"
                      @click="changeColor($event, scope.$index)"></span>
                  </template>
                </el-table-column>
                <el-table-column label="显示" width="60">
                  <template  scope="scope">
                    <span class="eye-ctl iconfont" :class="scope.row.open ? ' icon-eye' : ' icon-hide'"
                      @click="eyeCtl(scope.row)"></span>
                  </template>
                </el-table-column>
              </el-table>
              
              <h3 class="no-data" v-else >－暂无数据－</h3>
            </div>

            <my-echart class="pie-chart" 
              v-if="tableData.length > 0"
              :options="pieChart"></my-echart>
          </div>

          <el-select class="hm-selector"
            popper-class="select-dropdown"
            size="small"
            v-if="tableData.length > 0"
            v-model="value">
            <el-option
              v-for="item in areaOption"
              :label="item.label"
              :value="item.value"
              @click="value = item.value">
            </el-option>
          </el-select>
        </div>
        <div v-else slot="detail">
          <h3>－暂无数据－</h3>
        </div>

      </left-tab>
    </div>
      
    <div class="color-picker" @click.stop="hidePop">
      <div class="wrap">
        <p class="triangle"></p>
        <h3>选择图例颜色</h3>
        <div class="clear">
          <span  v-for="(item, index) in layerSld.normal" 
            :style="{background: item}"
            @click="cropColor = item">
            <i class="iconfont icon-ok"
              v-if="cropIndex >= 0 && tableData[cropIndex].color == item"></i>
            <em class="classification-all-height"></em>
          </span>
        </div>
      </div>
    </div>

    <div class="dcp-ctl" v-if="hasDcp">
      <span class="dcp-toggle"
        @click="showDcp = !showDcp">
        <i v-show="!showDcp">分布数据动态监测</i>
        <i class="iconfont"
          :class="showDcp ? 'icon-bottom' : 'icon-top'"></i>
      </span>
      <dcp-control 
        @layerOpacity="dcplayerOpacityCtl"
        v-show="showDcp"
        :dates="dcpDates">
      </dcp-control>
    </div>

    <footer-lite></footer-lite>
  </div>
</template>

<script>
import leftTab from 'components/leftTab';
import leftList from './list';
import dcpControl from './dcp';
import request from 'api/request.js'
import model from 'api/model.js'
import echart from './echart/index.js'
import configData from '../../config/data.js'
import config from 'config/env/config.env.js'
import footerLite from 'components/footerlite'

export default{
  data(){
    return {
      areaOption: [{
        value: 'm',
        label: '万亩'
      }, {
        value: 'h',
        label: '千公顷'
      }],
      value: 'm',
      curIndex: -1,
      bounds: [],
      title: '',
      backList: false,
      leftLoading: false,
      haveCpDetail: false,
      list: [],
      tableData: [],
      pieChart: null,
      options: null,
      showTree: false,
      treeNodeName: '',
      tree: [],
      defaultProps: {
        children: 'contain',
        label: 'area_name'
      },
      code: null,
      opacity: 100,
      layerName: '',
      cpLayer: null,
      dcpLayers: [],
      layerSld: {},
      cropColor: '',
      cropIndex: -1,
      popTarg: null,
      loadedDcp: false,
      hasDcp: false,
      showDcp: false,
      dcpData: {},
      dcpDates: [],
      dcpTitle: '',
      dcpId: '',
      dcpTree: [],
      showList: true,
      cpCacheData: {},
      icons: {
        "201": 'icon-hetao-',
        "135": 'icon-shuidao-',
        "117": 'icon-ganzhe-',
        "134": 'icon-yumi-'
      }
    }
  },
  mounted() {
    this.popTarg = document.getElementsByClassName('color-picker')[0]
    this.layerSld.normal = configData.sld.cfLayerColors
    this.layerSld.selected = configData.sld.cfSelLayerColors
    this.leftLoading = true

    request.distributeList().then((response) => {
      if (response.status === 200 && response.data.length !== 0) {
        this.list = model.formatCps(response.data)
        this.curIndex = 0
        this.leftLoading = false
      } else {
        this.list = []
        this.leftLoading = false
      }
    })
  },
  methods: {
    initMap (map) {
      this.map = map;
    },
    toggleListStatus(isShow) {
      this.showList = isShow;
    },
    changeOpacity(value) {
      this.opacity = value
    },
    switchList(topicId) {
      if (this.list.length === 0) {
        return
      }
      this.backList = !this.backList; 
      if (!this.backList) {
        this.title = "选择产品"
      } else {
        this.title = this.list[this.curIndex].title;
      }
    },
    hidePop() {
      this.showTree = false
      this.popTarg.style.display = 'none'
    },
    treeNodeClick(data) {
      this.bounds = model.formatBounds(data)
      this.code = data.area_id
      this.treeNodeName = data.area_name
    },
    changeIndex(index) {
      this.backList = true
      this.curIndex = index
    },
    eyeCtl(row) {
      row.open = !row.open
      var opacity = row.open ? 1 : 0,
        curSld = this.getSld(row.id, null, opacity, this.layerName)

      this.updateSld(curSld, this.cpLayer);
    },
    changeColor(ev, index) {
      var oEvent = ev|| window.event;
      var y = oEvent.clientY - 24
      this.popTarg.style.top = `${y}px`
      this.popTarg.style.display = 'block'
      this.cropIndex = index
    },
    getCpData(id, callback) {
      if (this.cpCacheData[id]) {
        this.setSldAttr(this.cpCacheData[id].cp, id)
        callback(this.cpCacheData[id])
      } else {
        request.distributeById(id).then((response) => {
          if (response.status !== 200 || response.data.status !== 0) {
            this.options = {noData: true}
            callback(null)
          } else {
            var formated = model.formatCpData(response.data, id, this.code)
            if (!formated) {
              this.options = {noData: true}
              callback(null)
            } else {
              this.cpCacheData[id] = formated
              this.setSldAttr(formated.cp, id)
              callback(formated)
            }
          }
        })
      }
    },
    getChartData(index) {
      var id = this.list[index].only_result,
        title = this.list[index].title

      this.getCpData(id, (formated) => {
        if (!formated) {
          this.options = {noData: true}
        } else {
          var chartData = this.getPieData(formated.cp, id)
          this.options = echart.getPie(chartData, title, 60, true);
        }
      })
    },
    getPieData (data, id) {
      var pieData = [];
      var crops = data.crops;
      for (var i = 0; i < crops.length; i++) {
        var dataItem = {
          name: crops[i].name, 
          value: crops[i].a,
          itemStyle: {
            normal: {
              color: this.tableData[i].color,
            }
          }
        }
        pieData.push(dataItem);
      }
      return pieData
    },
    addLayer(layerName, sld) {
      var extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857")),
        layerOptions = {
          serverUrl: config.mapUrl,
          visible: !this.showDcp,
          extent: extent,
          layerName: layerName,
          opacity: this.opacity/100,
          sld: sld
        }
      return this.$refs['map'].addGeoLayer(layerOptions, this.map)
    },
    removeCPLayer() {
      if (this.cpLayer) {
        this.map.removeLayer(this.cpLayer)
        this.cpLayer = null
      }
    },
    setSldAttr (data, id) {
      if (data) {
        this.layerSld.color = [];
        this.layerSld.opacity = [];
        this.layerSld.id = [];  
        this.layerSld.name = [];

        for (var i = 0; i < data.crops.length; i++) {
          this.layerSld.color.push(this.layerSld.normal[i]);
          this.layerSld.opacity.push('1');
          this.layerSld.name.push(data.crops[i].name);
          this.layerSld.id.push(data.crops[i].id);
        }
      }
    },
    getSld(id, color, opacity, layerName) {
      var sld = "";
      for (var i = 0; i < this.layerSld.id.length; i++) {
        if(this.layerSld.id[i] == id) {
          this.layerSld.color[i] = color ? color : this.layerSld.color[i];
          this.layerSld.opacity[i] = opacity;
        }
      
        sld += '<ColorMapEntry color="'+ this.layerSld.color[i] +
                  '" quantity="'+ this.layerSld.id[i] +
                  '" label="'+ this.layerSld.name[i] +
                  '" opacity="'+ this.layerSld.opacity[i] +
                '" />';
      } 
      return this.appendSld(sld, layerName);
    },
    appendSld (sldBody, layerName) {
      return `<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
                <NamedLayer>
                  <Name>${layerName}</Name>
                  <UserStyle>
                    <Title>SLD Cook Book: Discrete colors</Title>
                    <FeatureTypeStyle>
                      <Rule>
                        <RasterSymbolizer>
                          <ColorMap type="values">
                            <ColorMapEntry color="#000000" quantity="0" label="no-data" opacity="0" />
                            ${sldBody}
                          </ColorMap>
                        </RasterSymbolizer>
                      </Rule>
                    </FeatureTypeStyle>
                  </UserStyle>
                </NamedLayer>
              </StyledLayerDescriptor>`;
    },
    updateSld(sld, layer) {
      layer.getSource().updateParams({SLD_BODY: sld});
    },
    initDcp() {
      request.dynamicDistributeId().then((response) => {
        if (!response.data || response.data.length <= 0) {
          return
        } else {
          this.dcpTitle = response.data[0].title;
          this.dcpId = response.data[0].only_result;
          this.getDcpById(this.dcpId)
        }
      })
    },
    getDcpById(id) {
      request.dynamicDistribute(id).then((response) => {
        if (response.status !== 200 || response.data.status != 0 || response.data[id].length < 2) {
          return
        } else {
          this.dcpData = model.formatDcp(response.data, id, this.code);
          // this.dcpDates = (() => this.dcpData.dates)()
          this.getArea(this.dcpData.area_code);
        }
      })
    },
    getArea(code) {
      var data = { arealist: [ { "grade": '4', "area_code": code } ] }

      request.getPartAreas(data).then((response) => {
        
        if (response.status !== 200 || response.data.status != '0') {
          console.log("接口返回:" + response.data.error_msg); 
        } else {
          this.dcpTree = response.data.data;
          this.hasDcp = true
        }
        this.addAllLayers(this.dcpData.layerArr)
      });
    },
    removeAllLayers() {
      for (var i = 0; i < this.dcpLayers.length; i++) {
        this.map.removeLayer(this.dcpLayers[i]);
      }
      this.dcpLayers = [];
    },
    addAllLayers(layerInfoList) {
      this.removeAllLayers();
      for(var i = 0; i < layerInfoList.length; i++) {
        for (var j = 0; j < layerInfoList[i].length; j++) {
          if (layerInfoList[i][j].code == this.code) {
            var layerName = "map:" + layerInfoList[i][j].id;
            var layer = this.addDcpLayer(layerName);
            this.dcpLayers.push(layer);
          }
        }
      }
    },
    addDcpLayer(layerName) {
      var extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
      var layerOptions = {
        serverUrl: config.mapUrl,
        visible: this.showDcp,
        extent: extent,
        layerName: layerName,
        sld: this.getDcpSld(layerName)
      }
      return this.$refs['map'].addGeoLayer(layerOptions, this.map)
    },
    dcplayerOpacityCtl (layerArr) {
      if (this.dcpLayers.length > 0) {
        for (var i = 0; i < layerArr.length; i++) {
          this.dcpLayers[i].setOpacity(layerArr[i] * this.opacity / 100)
        }
      }
    },
    getDcpSld(layerName) {
      var _sld = "";
      for (var i = 0; i < this.layerSld.id.length; i++) {
        _sld += '<ColorMapEntry color="'+ this.layerSld.color[i] +
                '" quantity="'+ this.layerSld.id[i] +
                '" label="'+ this.layerSld.name[i] +
                '" opacity="'+ this.layerSld.opacity[i] +'" />';
      } 
      
      return  this.appendSld(_sld, layerName);
    },
    getCpCrops(data) {
      for (let i = 0; i < data.cp.crops.length; i++) {
        data.cp.crops[i].open = true
        data.cp.crops[i].i = i + 1;
        data.cp.crops[i].color = this.layerSld.normal[i];
        data.cp.crops[i].area = (Number(data.cp.crops[i].a) / 10000 / 10000 * 15).toFixed(2);
      }
      return data.cp.crops
    },
    renderCpDetail(id) {
      this.leftLoading = true
      this.removeCPLayer()
      this.getCpData(id, (formated) => {
        if (!formated) {
          this.options = {noData: true}
        } else {
          this.tableData = this.getCpCrops(formated)
          var chartData = this.getPieData(formated.cp, id)
          this.pieChart = echart.getPie(chartData, '', 50, true);

          this.tree = formated.areaList
          this.code = this.tree[0].area_id
          this.treeNodeName = this.tree[0].area_name
          this.bounds = model.formatBounds(this.tree[0])
          this.layerName = 'map:' + formated.cp.id
          var sld = this.getSld(id, null, 1, this.layerName)
          this.cpLayer = this.addLayer(this.layerName, sld)
          this.haveCpDetail = true
        }
        this.leftLoading = false
      })
    }
  },
  watch: {
    curIndex: function (index) {
      if (this.list.length === 0) {
        return
      }
      this.backList = true
      this.title = this.list[index].title;

      var id = this.list[index].only_result
      this.renderCpDetail(id)
    },
    code: function (code) {
      var id = this.list[this.curIndex].only_result
      this.renderCpDetail(id)
      
      if (!this.loadedDcp && code) {
        this.loadedDcp = true
        this.initDcp()
      } else {
        this.addAllLayers(this.dcpData.layerArr)
      }
    },
    cropColor: function (color) {
      var id = this.tableData[this.cropIndex].id
      this.tableData[this.cropIndex].color = color
      var curSld = this.getSld(id, color, 1, this.layerName)
      this.updateSld(curSld, this.cpLayer);
      // change chart color
      var id = this.list[this.curIndex].only_result

      this.getCpData(id, (formated) => {
        if (!formated) {
          this.pieChart = {noData: true}
        } else {
          var chartData = this.getPieData(formated.cp, id)
          this.pieChart = echart.getPie(chartData, '', 50, false);
        }
      })
    },
    value: function (value) {
      if (value === 'm') {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].area = (Number(this.tableData[i].a) / 10000 / 10000 * 15).toFixed(2);
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].area = (Number(this.tableData[i].a) / 10000 / 10000 * 10).toFixed(2);
        }
      }
    },
    showDcp: function (showDcp) {
      if (this.showDcp && this.dcpData && this.dcpDates.length === 0) {
        this.dcpDates = (() => this.dcpData.dates)()
      }
      this.cpLayer.setVisible(!showDcp);
      for (var i = 0; i < this.dcpLayers.length; i++) {
        this.dcpLayers[i].setVisible(showDcp);
      }
    },
    opacity: function (opacity) {
      if (this.dcpLayers.length > 0) {
        for (var i = 0; i < this.dcpLayers.length; i++) {
          var oldOpc = this.dcpLayers[i].getOpacity()
          this.dcpLayers[i].setOpacity(oldOpc * this.opacity / 100)
        }
      }
      this.cpLayer.setOpacity(opacity/100);
    }
  },
  beforeDestroy(){
    this.removeCPLayer()
  },
  components: {
    leftTab,
    leftList,
    dcpControl,
    footerLite
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .c-left-tab {
    position: fixed;
    min-height: 600px;
    left: 10px;
    top: 70px;
  }
  .hr-control {
    position: absolute;
    top: 90px;
    width: 100%;
    border-top: 0.1px #d2d2d2 solid;
  }
  .detail-container {
    position: absolute;
    background: #fff;
    width: 318px;
    top: 160px;
    box-shadow: 0 2px 8px #aeaeae;
    border-radius: 3px;

    .tb-detail {
      background: #fff;
      table {
        width: 100%;
        padding-left: 5px;
        tr {
          height: 34px;
          text-align: center;
          color: #484848;
          font-size: 12px;
          td:nth-child(1) {
            text-align: center !important;
          }
        }
      }
      .no-data {
        text-align: center;
      }
    }

    .pie-chart {
      width: 298px;
      height: 170px;
      margin: 10px 8px;
      border: 1px #d3d3d3 solid;
    }
  }
  .selcolor {
    display: inline-block;
    width:  10px;
    height: 10px;
  }
  .icon-hetao- {
    color: #896320;
  }
  .icon-ganzhe- {
    color: #66052D;
  }
  .icon-shuidao- {
    color: #87BF19;
  }
  .icon-yumi- {
    color: #F2CD14;
  }
  .eye-ctl {
    font-size: 14px;
    color: #8bbcf9;
  }
  .eye-ctl, .selcolor {
    left: 7px;
    position: relative;
    cursor: pointer;
  }
  .color-picker {
    position: absolute;
    display: none;
    left: 348px;
    border: 1px solid #d3d3d3;
    background: #fff;
    box-shadow: 2px 1px 8px #8a8a89;
    padding-left: 8px;
    .wrap {
      position: relative;
      width: 157px;

      span {
        line-height: 20px;
        position: relative;
        display: block;
        float: left;
        width: 30px;
        height: 20px;
        margin-bottom: 5px;
        text-align: center;

        i {
          display: inline;
          color: #fff;
        }
        em {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: rgba(255,255,255,.4);
        }
      }
    }
    .triangle {
      position: absolute;
      top: 14px;
      left: -28px;
      width: 20px;
      height: 20px;
      background: url(/static/assets/img/common/class-triangle.png) no-repeat;
    }
    h3 {
      font-size: 14px;
      font-weight: normal;
      line-height: 26px;
      text-align: left;
      color: #474747;
    }
  }
  .hm-selector {
    position: absolute;
    top: 165px;
    width: 72px;
    left: 125px;
  }
  .dcp-toggle {
    position: absolute;
    height: 30px;
    top: -30px;
    right: 5px;
    background: #fff;
    cursor: pointer;
    border-radius: 3px; 
    font-size: 14px;
    line-height: 1;
    padding: 10px 10px 0 10px;
    .iconfont {
      line-height: 20px;
      font-size: 20px;
    }
  }
  .dcp-ctl {
    position: fixed;
    bottom: 30px;
    width: 100%;
  }
</style>