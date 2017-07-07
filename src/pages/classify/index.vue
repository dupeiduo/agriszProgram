<template>
  <div @click="hidePop" class="scale-atbottom">
    <my-map class="map" 
      @initMap="initMap" 
      :switchCtl="true"
      :top="97"
      borderRadius="4px"
      :centerCtl="{use: true, bounds: bounds}"
      :maxZoom="18" ref="map"
      :useTools="true"></my-map>
    <div>
      <left-tab
        class="c-left-tab" 
        :showList="showList"
        :leftTab="[]"
        :title="title"
        :backList="backList"
        :listTitle="'返回查看所有分布产品'"
        @toggleList="toggleListStatus"
        @changeState="switchList">

        <left-list slot="list"
          :list="list" 
          :options="options"
          :curIndex="curIndex"
          @getChartData="getChartData"
          :showNoData="!leftLoading"
          @listChange="switchProduct"></left-list>

        <div v-if="haveCpDetail || leftLoading" slot="detail" class="crop-product" v-loading.lock="leftLoading">
          <div :style="{'max-height': getScreenHeight - 120 + 'px'}">
          <h3 class="tree-detail-title">{{productTitle}}</h3>
          <div class="tree-classify-con pr dropdown-zIndex" @click.stop="hidePop">
            
            <div class="area-tree">
              <tree 
                :treeData="treeData" 
                :showTree="showTree"
                @getTreeNode="getTreeNode"
                @changeShowTreeStatus="getTreeStatus">
              </tree>
            </div>
            <div class="sub-area-tree">
              <tree 
                :treeData="filterTree" 
                :showTree="subShowTree"
                @getTreeNode="getFilterTreeNode" 
                @changeShowTreeStatus="getSubTreeStatus"
                ></tree>
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
          <div class="classify-contrast  pr">
            <span class="adv-test">对比地图实况</span>
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
            <div class="pie-chart-container">
              <div class="pie-chart">
                <p class="pie-chart-title">作物分布统计图</p>
                <my-echart
                  v-if="hasCropArea"
                  :options="pieChart"
                  class="pie-chart-body">
                </my-echart>
                <div v-else class="none-crop">
                  <p class="iconfont icon-chazhaopingmunei"></p>
                  该地区未发现作物
                </div>
              </div>
            </div>
            
          </div>

          </div>
        </div>
        <div v-else-if="tableData.length == 0 && !leftLoading" slot="detail">
          <expect-data class="list-nodata-bg pr" 
            :showSectionData="true"></expect-data>
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

    <imageviewer :showImgZoomComponent="showImgZoomComponent"
      :imgDate="imgDate"
      :imgUrl="imgUrl"
      @hideImageViewer="showImgZoomComponent=false"></imageviewer>
    <expect-data :showPageData="true" v-if="noMapData"></expect-data>
  </div>
</template>

<script>
import leftTab from 'components/leftTab';
import leftList from './list';
import tbDetail from './tbdetail';
import dcpControl from './dcp';
import imageviewer from './imageviewer';
import request from 'api/request.js'
import model from 'api/model.js'
import echart from './echart/index.js'
import configData from '../../config/data.js'
import config from 'config/env/config.env.js'
import noData from 'components/noData';
import imgLayerCtl from 'agrisz-lib-piccluster'
import {mapGetters} from 'vuex'
import {elementUtil} from 'plugins/utils.js'
import tree from '../../components/tree'
import expectData from 'components/expectData/'
import subFilter from '../monitor/subfilter'

export default{
  data(){
    return {
      map: null,
      curIndex: -1,
      bounds: [],
      title: '',
      backList: true,
      leftLoading: true,
      firstLoad: true,
      haveCpDetail: false,
      list: [],
      tableData: [],
      showNoData: false,  
      pieChart: null,
      hasCropArea: true,
      options: null,
     
      treeData: [],
      showTree:false,
      currentTreeNode: null,

      filterTree: [],
      subShowTree: false,
      filteredCodes: [],

      code: null,
      opacity: 90,
      layerNames: [],
      cpLayers: [],
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

      showPhoto: false,
      showPageData: false,
      noMapData: false
    }
  },
  filters: {
    formatDatetime(value) {
      return value.replace(/-/g, "/")
    }
  },
  computed: {
    ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
    })
  },
  mounted() {
    this.layerSld.normal = configData.sld.cfLayerColors
    this.layerSld.selected = configData.sld.cfSelLayerColors
    this.fetchCpList()
  },
  methods: {
    fetchCpList() {
      this.showPopMsgUnAutoHide("图层加载中...")
      this.leftLoading = true
      this.changeLoadOpacity("rgba(255,255,255,1)")

      request.distributeList().then((response) => {
        if (response && response.status === 200 && response.data.status === 200) {
          this.list = model.formatCps(response.data.data)
        } 

        if(this.list === 0) {
          this.noMapData = true
          this.hidePopMsg()

        } else {
          this.curIndex = 0
        }
        this.leftLoading = false
      })
    },
    initMap (map) {
      this.map = map;
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
      this.subShowTree = false
    },
    getTreeStatus(status){
      this.showTree = status
    },
    getSubTreeStatus(status){
      this.subShowTree = status
    },
    getTreeNode(data){
      this.currentTreeNode = data
      this.code = data.area_id;
      this.bounds = model.formatBounds(data)
      
      this.getFilterTree(data.grade, data.minGrade)
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
    getFilterTreeNode(data) {
      var name = data.area_name
      var grade = data.value

      var codes = this.currentTreeNode[grade] 
          ? [this.currentTreeNode.area_id].concat(this.currentTreeNode[grade])
          : [this.currentTreeNode.area_id]

      
      this.filteredCodes = this.getCodes(grade, codes)
      var areaCodes = this.filteredCodes.concat(this.currentTreeNode.area_id)

      this.addAreaLayers(areaCodes)
      this.addCpLayers(this.filteredCodes)
    },
    getCodes(grade, codes) {
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

      return result
    },
    removeAreaLayers() {
      if (this.areaLayer) {
        this.map.removeLayer(this.areaLayer)
        this.areaLayer = null
      }
    },
    addAreaLayers(codes) {
      this.removeAreaLayers()

      this.areaLayer = this.$refs.map.getMultyAreaLayer(config.mapUrl, codes, this.bounds)
      this.map.addLayer(this.areaLayer)
    },
    removeCpLayers() {
      if (this.cpLayers.length > 0) {
        for (var i = 0; i < this.cpLayers.length; i++) {
          var layer = this.map.removeLayer(this.cpLayers[i])
        }
      }
      
      this.cpLayers = []
      this.layerNames = []
    },
    addCpLayers(codes) {
      this.removeCpLayers()
      var cpId = this.list[this.curIndex].only_result
      var vid = this.list[this.curIndex].id 
      var notExist = 0

      var areas = []
      console.log(codes.length)
      for (let i = 0; i < codes.length; i++) {
        this.getCpData(cpId, vid, (result)=>  {
          if (result) {
            let layerName = "map:" + result.cp.id
            let sld = this.getSld(cpId, null, 1, layerName)

            this.cpLayers[i] = this.addLayer(layerName, sld)
            this.layerNames[i] = layerName

            areas.push(result.cp)

          } else {
            notExist++
          } 

          if (i === codes.length-1 && notExist === codes.length) {
            this.addParentCpLayer(cpId, vid)
          }
          this.hidePopMsg()
          
          if (codes.length === areas.length) {
            this.formatMutyArea(areas, cpId)
          }
          
        }, false, codes[i])
      }
    },
    addParentCpLayer(cpId, vid) {
      this.getCpData(cpId, vid, (result)=>  {
        if (result) {
          let layerName = "map:" + result.cp.id
          let sld = this.getSld(cpId, null, 1, layerName)

          this.cpLayers[0] = this.addLayer(layerName, sld)
          this.layerNames[0] = layerName

          this.formatMutyArea([result.cp])

        } else {
          // 暂无分布数据
          console.log("暂无分布数据")
          this.showPopMsgUnAutoHide("暂无数据")
        } 
      }, false, this.currentTreeNode.area_id)
    },
    switchProduct(index) {
      this.backList = true
      this.curIndex = index
      this.productTitle = this.list[this.curIndex].title
    },
    getCpData(id, vid, callback, unchangeColor, code) {
      code = code ? code : this.code
      if (this.cpCacheData[id]) {
        var formated = model.formatCpData(this.cpCacheData[id], code)
        if (!unchangeColor) {
          this.setSldAttr(formated.cp, id)
        }
        callback(formated)

      } else {
        request.distributeIAById(vid).then((response) => {
          if (response.status !== 200 || response.data.status !== 200) {
            this.options = {noData: true}
            callback(null)
            
          } else {
            this.cpCacheData[id] = response.data.data[id]
            var formated = model.formatCpData(this.cpCacheData[id], code)
            
            if (!formated) {
              this.options = {noData: true}
              this.tableData = []
              this.showNoData = true
              callback(null)

            } else {
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
        title = this.list[index].title,
        vid = this.list[index].id

      this.getCpData(id, vid, (formated) => {
        if (!formated) {
          this.options = {noData: true}
        } else {
          // the bug after hover bar chart
          // this.tableData = this.getCpCrops(formated)
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
              color: this.tableData[i] ? this.tableData[i].color : this.layerSld.normal[i],
            }
          }
        }
        pieData.push(dataItem);
      }
      return pieData
    },
    addLayer(layerName, sld) {
      var extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
      var layerOptions = {
          serverUrl: config.mapUrl,
          layerName: layerName,
          extent: extent,
          visible: !this.showDcp,
          opacity: this.opacity/100,
          sld: sld
        }
      var layer = this.$refs['map'].getTileLayer(layerOptions)
      this.map.addLayer(layer)
      
      return layer
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
    setLayerVisible({id, open, name}) {
      var index = this.getCropIndex(id)
      this.tableData[index].open = open
      
      this.$refs['popMessage'].showDialog()
      this.popTitle = open ? `已显示${name}分布图层` : `已隐藏${name}分布图层`
      
      var opacity = open ? 1 : 0
      
      for (var i = 0; i < this.layerNames.length; i++) {
        let curSld = this.getSld(id, null, opacity, this.layerNames[i])
        this.updateSld(curSld, this.cpLayers[i]);
      }
    },
    setLayerColor({id, color}) {
      this.cropIndex = this.getCropIndex(id)

      for (var i = 0; i < this.layerNames.length; i++) {
        let curSld = this.getSld(id, color, 1, this.layerNames[i])

        this.tableData[this.cropIndex].color = color
        this.tableData[this.cropIndex].open = true
        this.updateSld(curSld, this.cpLayers[i]);
      }

      this.freshChartColor()
    },
    getCropIndex(id) {
      var index = -1
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {

          index = i
          break
        }
      }
      return index
    },
    updateSld(sld, layer) {
      layer.getSource().updateParams({SLD_BODY: sld});
    },
    initDcp() {
      request.dynamicDistributeId().then((response) => {
        if (!response || response.status !== 200 || response.data.status !== 200 || response.data.data.length <= 0) {
          return
        } else {
          this.dcpTitle = response.data.data[0].title;
          this.dcpId = response.data.data[0].only_result;
          this.getDcpById(this.dcpId)
        }
      })
    },
    getDcpById(id) {
      request.dynamicDistribute(id).then((response) => {
        if (response.status !== 200 || response.data.status != 0 || !response.data[id] || response.data[id].length < 2) {
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
    renderCpDetail(id, vid) {
      this.leftLoading = true
      this.removeAreaLayers()
      this.removeCpLayers()
      this.showPopMsgUnAutoHide("图层加载中...")
      
      this.getCpData(id, vid, (formated) => {
        if (!formated) {
          this.options = {noData: true}
          this.haveCpDetail = false
          this.tableData = []

        } else {
          this.tableData = this.getCpCrops(formated)
          var chartData = this.getPieData(formated.cp, id)
          this.pieChart = echart.getPie(chartData, '', 50, true);
          
          this.initTree(formated.areaList)

          this.haveCpDetail = true
          this.hidePopMsg()
        }
        this.leftLoading = false
        this.firstLoad = false
      })
    },
    formatMutyArea(cp, id) {
      var formated = {
        cp: {
          crops: []
        }
      }
      var total = 0
      var area = []
      var len = cp.length
      
      cp.forEach((current, index, arr)=> {
        for (var i = 0; i < current.crops.length; i++) {
          area[i] = area[i] ? area[i] : 0
          area[i] += current.crops[i].a
          if (index === len - 1) {
            var item = {
              a: area[i],
              color: current.crops[i].color,
              name: current.crops[i].name,
              id: current.crops[i].id
            }
            formated.cp.crops.push(item)
          }
          total += area[i]
        }
      })

      this.hasCropArea = total !== 0
      this.tableData = this.getCpCrops(formated)
      var chartData = this.getPieData(formated.cp, id)
      this.pieChart = echart.getPie(chartData, '', 50, true);
    },
    initTree(areaList) {
      this.treeData = model.formatMonitorTree(areaList).treeData
      this.code = this.treeData[0].area_id
      this.bounds = model.formatBounds(this.treeData[0])
      this.getTreeNode(this.treeData[0])
    },
    freshChartColor() {
      var cpId = this.list[this.curIndex].only_result,
        vid = this.list[this.curIndex].id

      this.getCpData(cpId, vid, (formated) => {
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
    },
    changeLoadOpacity(color) {
      setTimeout(()=> {
        var dom = document.getElementsByClassName('el-loading-mask')
        elementUtil.setDomStyle(dom, 'backgroundColor', color)
      })
    },
    fetchPictureList(code) {
      var data = {
        area_codes: -1,
        // area_codes: [code],
        img_type: this.imgType
      }
      request.geoImageList(data).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          this.imgList  = response.data.data
        }
      })
    },
    addImgLayer(imgList) {

      const imgClickCb = ({index, pid}) => {
        this.loadImgZoomComponent(index, imgList)
      }
      const imgHoverCb = (indexs) => {
        // console.log(indexs)
      }
      if (imgList && imgList.length > 0) {
        imgLayerCtl.openHoverStyle()
        imgLayerCtl.setDistance(50) 
        imgLayerCtl.openDeric() 
        imgLayerCtl.setRootAssertUrl(config.sharedAssetServer)
        imgLayerCtl.addPicturesLayer(this.map, imgList, imgClickCb, imgHoverCb)

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
    showPopMsgUnAutoHide(msg) {
      this.$refs['popMessage'].showUnAutoHideDialog()
      this.popTitle = msg
    },
    hidePopMsg() {
      this.$refs['popMessage'].hidePopMsgImmediate()
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
      if (this.list.length === 0) {
        this.hidePopMsg()
        return
      }
      this.backList = true
      this.title = this.list[index].title
      this.productTitle = this.title

      var id = this.list[index].only_result,
        vid = this.list[index].id
      this.renderCpDetail(id, vid)
    },
    code: function (code) {
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
      
      for (var i = 0; i < this.layerNames.length; i++) {
        let curSld = this.getSld(id, color, 1, this.layerNames[i])
        this.updateSld(curSld, this.cpLayers[i]);
      }

      // change chart color
      var cpId = this.list[this.curIndex].only_result,
        vid = this.list[this.curIndex].id

      this.getCpData(cpId, vid, (formated) => {
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

      for (var i = 0; i < this.cpLayers.length; i++) {
        this.cpLayers[i].setVisible(!showDcp);
      }

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

      for (var i = 0; i < this.cpLayers.length; i++) {
        this.cpLayers[i].setOpacity(opacity/100);
      }
      
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
    }
  },
  beforeDestroy(){
    
  },
  components: {
    leftTab,
    leftList,
    tbDetail,
    dcpControl,
    noData,
    imageviewer,
    tree,
    expectData
  }
}
</script>
<style
 lang="less" rel="stylesheet/less" scoped>
@import '../../assets/style/common';
.c-left-tab {
    width:358px;
}
  .detail-container {
    position: relative;
    background: #fff;
    width: 100%;
    padding-bottom: 10px;
    .adv-border-bottom-radius();
  }

  .pie-chart-container{
    padding: 10px 14px;
    box-sizing: border-box;
    .pie-chart {
      position: relative;
      border: 1px #d6d6d6 solid;
      background: #f9f9f9;
      .adv-common-border-radius();
      .pie-chart-title {
        .adv-title-after-vertical-line-small();
        line-height: 36px;
      }
      .pie-chart-body {
        margin: auto;
        width: 330px;
        height: 170px;
      }
    }
    .none-crop {
      color: #b1aaa2;
      text-align: center;
      height: 120px;
      padding-top: 50px;
      p {
        font-size: 30px;
      }
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
    overflow-y: auto;
    overflow-x: hidden;
    .adv-border-bottom-radius();
    .tree-detail-title {
      line-height: 40px;
      background: #9ed132;
      padding-left: 12px;
      font-size: 16px;
      color: #fff;
    }
    .tree-classify-con {
      padding: 18px 14px 0;
      box-sizing: border-box;

      .area-tree {
        width: 180px;
      }
      .sub-area-tree {
        width: 134px;
        float: right;
        margin-top: -34px;
        margin-right: 0px;
      }
    }
    .slider-container {
      margin: 0 12px;
    }
  }

  .list-nodata-bg {
    width: 358px;
    min-height: 300px; 
    overflow-y: auto;
    .adv-border-bottom-radius();
  }
  .classify-contrast {
    position: relative;
     width: 290px;
     padding: 17px 14px; 
     line-height: 12px;
     &:before {
      position: absolute;
      content: '';
      width: 358px;
      height: 1px;
      background: #d8d8d8;
      left: 0;
      top: 0;
     }
    .contrast-switch {
      font-size: 12px;
      position: absolute;
      right: -24px;
      top: 10px;
    }
  }
</style>
