<template>
  <div @click="hidePop" class="scale-atbottom">
    <my-map class="map" 
      @initMap="initMap" 
      :switchCtl="true"
      :top="97"
      borderRadius="4px"
      :centerCtl="{use: true, bounds: bounds}"
      :addTileAreas="{code: code, areas: (showDcp ? dcpTree : tree), extent: bounds}"
      :maxZoom="14" ref="map"
      :useTools="true"></my-map>
    <div class="c-left-tab" 
      :style="{width: leftLoading ? '358px' : '0'}"
      v-loading.lock="leftLoading">
      <left-tab 
        :showList="showList"
        @toggleList="toggleListStatus"
        :leftTab="[]"
        :title="title"
        :backList="backList"
        :listTitle="'返回查看所有分布产品'"
        @changeState="switchList">

        <left-list slot="list" 
          :list="list" 
          :options="options"
          :curIndex="curIndex"
          @getChartData="getChartData"
          :showNoData="!leftLoading"
          @listChange="changeIndex"></left-list>

        <div v-if="haveCpDetail" slot="detail" class="crop-product">
          <h3 class="tree-detail-title">{{productTitle}}</h3>
          <div class="tree-classify-con pr" @click.stop="hidePop">
            <div>
              <input class="tree-input class-tree-input" type="text" readonly 
                @click="toggleTree" 
                :value="treeNodeName">
              <el-tree class="tree" 
                highlight-current
                v-if="showTree" 
                :data="tree" 
                :props="defaultProps" 
                @node-click="treeNodeClick">
              </el-tree>
              <div v-if="showTree" class="confirm-btn-con">
                <span @click="toggleTree" class="confirm-btn">确&nbsp;&nbsp;定</span>
              </div>
            </div>
          </div>
            
          <div class="block slider-container pr classify-slider">
            <opacity-ctl 
              :opacity="opacity"
              :right="'44px'"
              :title="'分布图层透明度'"
              @changeOpacity="changeOpacity"
              ></opacity-ctl>
          </div>
          <div class="classify-contrast  pr slider-container">
            对比地图实况
            <el-switch class="contrast-switch ps"
              :width=56
              v-model="showImgZoomPoints"
              on-color="#8fc31f"
              off-color="#95adc4"
              on-text="显示"
              off-text="隐藏">
            </el-switch>
          </div>
          <div class="detail-container">
            <tb-detail
              :tableData="tableData"
              :loading="leftLoading"
              :layerSld="layerSld"
              @changeUnit="changeUnit"
              @setLayerVisible="setLayerVisible"
              @setLayerColor="setLayerColor"></tb-detail>
           
            <div class="pie-chart">
              <p class="pie-chart-title">作物分布统计图</p>
              <my-echart
              v-if="tableData.length > 0"
              :options="pieChart"
              class="pie-chart-body"
              >
              </my-echart>
            </div>
          </div>

        </div>
        <div v-else-if="tableData.length == 0 && !leftLoading" slot="detail">
          <h3>－暂无数据－</h3>
        </div>

      </left-tab>
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
    <no-data :noLayer="showNoData"></no-data>

    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
    <my-searchpoi right="134px" :map="map" @setCenter="setCenter"></my-searchpoi>
    <my-photozoom  
      :showPhoto="showImgZoomComponent"
      :imageDate="imgDate"
      :imageUrl="imgUrl" 
      @hidePhotoZoom="showImgZoomComponent = false"></my-photozoom>
  </div>
</template>

<script>
import leftTab from 'components/leftTab';
import leftList from './list';
import tbDetail from './tbdetail';
import dcpControl from './dcp';
import request from 'api/request.js'
import model from 'api/model.js'
import echart from './echart/index.js'
import configData from '../../config/data.js'
import config from 'config/env/config.env.js'
import noData from 'components/noData';
import imgLayerCtl from 'agrisz-lib-piccluster'


export default{
  data(){
    return {
      map: null,
      curIndex: -1,
      bounds: [],
      title: '',
      backList: false,
      leftLoading: true,
      haveCpDetail: false,
      list: [],
      tableData: [],
      showNoData: false, 
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
      opacity: 90,
      layerName: '',
      cpLayer: null,
      dcpLayers: [],
      layerSld: {},
      cropColor: '',
      cropIndex: -1,
      popTop: '0px',
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
      productTitle: '',
      
      popTitle: '',

      imgType: 1,

      showImgZoomPoints: false,

      imgList: [],
      imgDate: '',
      imgUrl: '',
      showImgZoomComponent: false,

      showPhoto: false
    }
  },
  filters: {
    formatDatetime(value) {
      return value.replace(/-/g, "/")
    }
  },
  mounted() {
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
    fetchPictureList(code) {
      var data = {
        // area_codes: -1,
        area_codes: [code],
        img_type: this.imgType
      }
      request.geoImageList(data).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.imgList  = response.data.data
        }
      })
    },
    addImgLayer(imgList) {

      const  pictureClickCb = ({index, pid}) => {
        this.loadImgZoomComponent(index, imgList)
      }

      if (imgList && imgList.length > 0) {
        
        imgLayerCtl.setDistance(50) 
        imgLayerCtl.setRootAssertUrl(config.sharedAssetServer)
        imgLayerCtl.addPicturesLayer(this.map, imgList, pictureClickCb)
      }
    },
    loadImgZoomComponent(index, imgList) {
      var image = this.getImgDetail(index, imgList)
      
      this.imgDate = image.date
      this.imgUrl = image.url
      this.showImgZoomComponent = true
    },
    getImgDetail(index, imgList) {
      var detail = {}
      detail.date = imgList[index].img_date.toString().split(' ')[0]
      detail.url = `${config.sharedAssetServer}/${imgList[index].img_file}`
      
      return detail
    },
    setCenter() {
      this.$refs['map'].setCenter()
    },
    toggleListStatus(isShow) {
      this.showList = isShow;
      if (!isShow) {
        this.showImgZoomPoints = false
      }
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
        this.title = "分布产品列表"
        this.showImgZoomPoints = false

      } else {
        this.title = this.list[this.curIndex].title;
      }
    },
    hidePop() {
      this.showTree = false
    },
    treeNodeClick(data) {
      this.bounds = model.formatBounds(data)
      this.code = data.area_id
      this.treeNodeName = data.area_name
    },
    toggleTree() {
      event.stopPropagation()
      this.showTree = !this.showTree
    },
    changeIndex(index) {
      this.backList = true
      this.curIndex = index
      this.productTitle = this.list[this.curIndex].title
    },
    setLayerVisible({id, open, name}) {
      var index = this.getIndexById(id)
      this.tableData[index].open = open
      
      this.$refs['popMessage'].showDialog()
      this.popTitle = open ? `已显示${name}分布图层` : `已隐藏${name}分布图层`
      
      var opacity = open ? 1 : 0,
        curSld = this.getSld(id, null, opacity, this.layerName)

      this.updateSld(curSld, this.cpLayer);
    },
    getIndexById(id) {
      var index = -1
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {

          index = i
          break
        }
      }
      return index
    },
    setLayerColor({id, color}) {
      this.cropIndex = this.getIndexById(id)

      var curSld = this.getSld(id, color, 1, this.layerName)

      this.tableData[this.cropIndex].color = color
      this.tableData[this.cropIndex].open = true
      this.updateSld(curSld, this.cpLayer);
      
      this.freshChartColor()
    },
    getCpData(id, callback, unchangeColor) {
      if (this.cpCacheData[id]) {
        if (!unchangeColor) {
          this.setSldAttr(this.cpCacheData[id].cp, id)
        }
        
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
              this.tableData = []
              this.showNoData = true
              callback(null)
            } else {
              this.cpCacheData[id] = formated
              this.setSldAttr(formated.cp, id)
              callback(formated)
              this.showNoData = false
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
          this.tableData = this.getCpCrops(formated)
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
      return `<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"><NamedLayer>
        <Name>${layerName}</Name><UserStyle><Title>SLD Cook Book: Discrete colors</Title><FeatureTypeStyle><Rule><RasterSymbolizer><ColorMap type="values"><ColorMapEntry color="#000000" quantity="0" label="no-data" opacity="0" />
        ${sldBody}</ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>`;
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
      
      if (layerInfoList && layerInfoList.length > 0) {
        for(var i = 0; i < layerInfoList.length; i++) {
          for (var j = 0; j < layerInfoList[i].length; j++) {
            if (layerInfoList[i][j].code == this.code) {
              var layerName = "map:" + layerInfoList[i][j].id;
              var layer = this.addDcpLayer(layerName);
              this.dcpLayers.push(layer);
            }
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
          this.haveCpDetail = false
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
    },
    freshChartColor() {
      var cpId = this.list[this.curIndex].only_result

      this.getCpData(cpId, (formated) => {
        if (!formated) {
          this.pieChart = {noData: true}
        } else {
          var chartData = this.getPieData(formated.cp, cpId)
          this.pieChart = echart.getPie(chartData, '', 50, false);
        }
      }, true)
    },
    changeUnit(value) {
      if (value === 'm') {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].area = (Number(this.tableData[i].a) / 10000 / 10000 * 15).toFixed(2);
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].area = (Number(this.tableData[i].a) / 10000 / 10000 * 10).toFixed(2);
        }
      }
    }
  },
  watch: {
    curIndex: function (index) {
      if (this.list.length === 0) {
        return
      }
      this.backList = true
      this.title = this.list[index].title
      this.productTitle = this.title

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

      code && this.fetchPictureList(code)
    },
    cropColor: function (color) {
      var id = this.tableData[this.cropIndex].id
      this.tableData[this.cropIndex].color = color
      var curSld = this.getSld(id, color, 1, this.layerName)
      this.updateSld(curSld, this.cpLayer);
      // change chart color
      var cpId = this.list[this.curIndex].only_result

      this.getCpData(cpId, (formated) => {
        if (!formated) {
          this.pieChart = {noData: true}
        } else {
          var chartData = this.getPieData(formated.cp, id)
          this.pieChart = echart.getPie(chartData, '', 50, false);
        }
      })
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
    },
    imgList(list) {
      this.showImgZoomPoints && this.addImgLayer(list) 
    },
    showImgZoomPoints(show) {
      if (show) {
        this.addImgLayer(this.imgList)  
      } else {
        this.showImgZoomComponent = false
        imgLayerCtl.removeLayer()
      } 
    }
  },
  beforeDestroy(){
    this.removeCPLayer()
    imgLayerCtl.destroy()
  },
  components: {
    leftTab,
    leftList,
    tbDetail,
    dcpControl,
    noData
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import '../../assets/style/reset';
.c-left-tab {
    position: fixed;
    min-height: 580px;
    left: 10px;
    top: 58px;

}
  .detail-container {
    position: relative;
    background: #fff;
    width: 358px;
    padding-bottom: 10px;
    .mixin-border-radius-bottom();
  }

  .pie-chart {
    width: 330px;
    height: 230px;
    margin: 10px auto;
    border: 1px #d6d6d6 solid;
    background: #f9f9f9;
    .mixin-common-border();
    .pie-chart-title {
      position: relative;
      line-height: 36px;
      padding-left: 20px;
      &:before {
        position: absolute;
        left: 10px;
        top: 10px;
        width: 4px;
        height: 15px;
        content: '';
        display: inline-block;
        background: #9ed132;
      }
    }
    .pie-chart-body {
      width: 330px;
      height: 170px;
    }
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
  .crop-product {
    background: #f3fbeb;
    .mixin-border-radius-bottom();
    .tree-detail-title {
      line-height: 40px;
      background: #9ed132;
      padding-left: 12px;
      font-size: 16px;
      color: #fff;
    }
    .class-tree-input {
      margin: 18px 12px 0;
    }
    .confirm-btn-con {
      position: absolute;
      width: 328px;
      height: 50px;
      background: #fff;
      top: 222px;
      left: 13px;
      z-index: 10002;
      
      .mixin-boxshadow();
    }
    .slider-container {
      margin: 0 12px;
    }
  }
  .classify-contrast {
     width: 96%;
     position: relative;
     left: -10px;
     border-top: 1px solid #d8d8d8;
     padding-left: 10px;
    .contrast-switch {
      position: absolute;
      right: 14px;
      top: 10px;
    }
  }
</style>