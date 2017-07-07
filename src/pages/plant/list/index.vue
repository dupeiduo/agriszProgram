<template>
  <div class="product-list" >
    <left-tab
      :leftTab="[]"
      :showList="showList"
      @toggleList="toggleListStatus"
      :title="'种植适宜性规划'"
      >
      
      <div slot="list" class="crop-list-bg" 
        v-if="cropList.length > 0 || loading" 
        v-loading.lock="loading">
        <div class="crop-list-container" :style="{'max-height': getScreenHeight - 120 + 'px'}" >
          <div class="crop-list">
            <my-button class="btns-con"
              :buttons="cropList"
              :curIndex="cropIndex"
              @btnClick="productSelect"
              ></my-button>
          </div>
          <div class="crop-desc-container">
            <div class="crop-desc">
              {{description}}
            </div>
            <div class="show-affector">
              <span @click="showEleSlider=true"><em>查看影响因素</em><i class="iconfont icon-icon-copy-copy"></i></span>
            </div>
          </div>

          <div class="area-tree" @click="stopHideTree">
              <tree 
              :treeData="treeData" 
              :inputColor="inputColor"
              :showTree="areaShowTree"
              @getTreeNode="getTreeNode"
              @treeConfirm="treeConfirm"
              @changeShowTreeStatus="getAreaShowTreeStatus"></tree>

          </div>
         

          <!-- pie echart -->
          <div class="fit-classfication-area pr">
            <span class="clssfication-information-btn" @click="showAreaStats">分级信息表</span>
            <div class="fit-container">
              <h3 class="fit-classfication-area-title">适宜性分级面积统计图</h3>
                <ul class="legend clear">
                  <li :style="{'background':item.background,'borderColor':item.color,'borderWidth':'1px','borderStyle': 'solid'}"  class="pr" v-for="(item,index) in legend">
                     <span :style="{'color':item.color}" class="iconfont icon-yuan"></span>
                     <span>{{item.displayName}}{{item.percent}}%</span>
                  </li>
                </ul>
                <div class="fit-classfication-area-echart-bg" v-loading.lock="barLoading">
                  <my-echart class="fit-echart" :options="cropHeathOption"></my-echart>
                </div>
            </div>
          </div>

          <div class="block slider-container pr plant-slider pl-opacity">
            <opacity-ctl
              :opacity="opacity"
              @changeOpacity="changeOpacity"
              :right="'44px'"
              :title="'图层透明度'"
              ></opacity-ctl>
          </div>
          <div class="download-bg">
              <div class="download-btns">
                <p @click="downloadImage">
                    <i class="iconfont icon-xiazai1"></i>
                    <span>{{cropName}}适宜性评价图</span>
                    <em v-if="imageUrl" class="animated fadeInRight fade-animation">点击下载</em>
                    <em v-else class="animated fadeInRight fade-animation no-file">暂无</em>
                </p>
                <p @click="downloadPdf">
                    <i class="iconfont icon-xiazai1"></i>
                    <span>适宜性报告</span>

                    <em v-if="pdfUrl" class="animated fadeInRight fade-animation">点击下载</em>
                    <em v-else class="animated fadeInRight fade-animation no-file">暂无</em>
                </p>
              </div>

              <div v-show="!cfListLoading && filteredCflist.length > 0"
                class="overlay-classify">
                <h3>作物分布</h3>

                <el-select v-model="currentClassify" placeholder="请选择分布产品"
                  v-loading.lock="cfListLoading"
                  @change="chooseClassify" class="drop-down-menu">
                  <el-option
                    v-for="(item, index) in filteredCflist"
                    :label="item.title"
                    :value="item.only_result">
                    </el-option>
                </el-select>

                <div v-if="currentClassify">
                  <div class="block slider-container pr plant-slider pl14">
                    <opacity-ctl
                      :opacity="classifyOpacity"
                      @changeOpacity="changeClassifyOpacity"
                      :right="'44px'"
                      :title="'图层透明度'"
                      ></opacity-ctl>
                  </div>

                  <tb-detail
                    :tableData="tableData"
                    :loading="cfListLoading"
                    :layerSld="layerSld"
                    @setLayerVisible="setLayerVisible"
                    @setLayerColor="setLayerColor"></tb-detail>
                </div>
              </div>

              <div v-show="!cfListLoading && filteredCflist.length===0" class="overlay-classify-no-data">
                <h3>作物分布</h3>
                <p>
                  <span class="iconfont icon-iconfontgantanhao"></span>
                  <span class="noProduct">{{areaName}}暂无分布产品</span>
                </p>
              </div>
              <div v-show="cfListLoading" 
                class="overlay-classify-loading"
                v-loading.lock="cfListLoading">
                <h3>作物分布</h3>
                <p>
                  加载中...
                </p>
              </div>
          </div>

          <div class="element-slider"
            :class="sliderAnimateClass"
            >
            
            <div class="popup-header pr">
              <h3 class="popup-header-title pr">{{cropName}}
                <div class="close ps">
                    <span class="el-icon-close"></span>
                    <em class="back-result ps animated fadeInRight fade-animation" @click="hideEleSlider"><i class="iconfont icon-icon-copy"></i>返回评价结果</em>
                </div>
              </h3>

              <ul class="ele-group clear">
                <li class="fl" v-for="(item, index) in eleGroup" :class="index === currentIndex  ? 'active':''">
                  <span @click="changeEleGroup(index)">{{item}}</span>
                </li>
              </ul>

              <div class="element-item">
                <my-button class="element-item-btns"
                  :buttons="filteredEle"
                  :curIndex="eleIndex"
                  @btnClick="eleClick"
                  ></my-button>
              </div>
            </div>
          </div>
        
          
        </div>  
      </div>    

      <expect-data class="crop-list-bg pr" :showSectionData="true" v-else-if="cropList.length === 0 && !loading"  slot="list"></expect-data>
      
    </left-tab>

    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
  </div>
</template>
<script>
import request from 'api/request.js'
import model from 'api/model.js'
import leftTab from 'components/leftTab'
import {elementUtil} from 'plugins/utils.js'
import configData from '../../../config/data.js'
import tbDetail from '../tbdetail'
import echart from '../echart/index.js'
import {mapGetters} from 'vuex'
import expectData from 'components/expectData/'
import tree from '../../../components/tree/'


export default {
  props: {
    cropList: {
      type: Array,
      default: []
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    currentLayer: {
      type: Object,
      default: null
    },
    classifyLayer: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    },
    barLoading: {
      type: Boolean,
      default: true
    },
    legend: {
      type: Array,
      default: []
    },
    cropFit: {
      type: Array,
      default: []
    },
    treeList: {
      type: Array,
      default:[]
    },
    hideTreeStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showList: true,
      description: '',
      cropIndex: -1,

      groupInfo: [],
      startGroup: false,

      opacity: 90,
      existClassify: true,
      classifyOpacity: 90,


      layerList: [],
      cropName: '',
      eleGroup: [],
      eleLists: [],
      eleIndex: -1,
      filteredEle: [],

      imageUrl: '',
      imageUrlList: null,

      classifyList: [],
      currentClassify: '',
      cfListLoading: true,

      sliderAnimateClass: '',
      showEleSlider: false,
      selectedOptions: [],

      popTitle: '',

      currentIndex: -1,
      currentLayerName: '',
      currentExtend: [],

      tableData: [],
      layerSld: {},

      cropHeathOption:{},
      treeData:[],
      resultId: '',
      toParentTreeData:'',
      filteredCflist: [],

      areaName: '所选区域',
      TREE_ROOT_CODE: 0,

      classifyCodes: [],
      showSectionData: false,
      firstLoad: true,
      inputColor:'#fafafa',

      areaShowTree:false,
    }
  },
  computed: {
    ...mapGetters({
        getScreenHeight: 'getScreenHeight'
      })
  },
  mounted() {
    this.changeLoadOpacity("rgba(255,255,255,1)")
    this.initElementInfo()
    this.initClassify()
  },
  methods: {
    getAreaShowTreeStatus(status){
      this.areaShowTree = status
    },
    stopHideTree(){
      if (this.hideTreeStatus === true) {
        this.$emit('initTreeStatus',false)
      }
    },
    initHideTree(){
      this.hideTreeBol = true
    },
    showAreaStats() {
      this.$emit('showAreaStats')
    },
    initElementInfo() {
      request.surElementInfo().then((response)=> {
        if (response && response.status === 200 && response.data.status === 0) {
          this.groupInfo = model.formatSurEleInfo(response.data.data)
          this.startGroup = true
        }
      })
    },
    initClassify() {
      this.layerSld.normal = configData.sld.cfLayerColors
      request.distributeList().then((response) => {
        if (response && response.status === 200 && response.data.length !== 0) {
          this.classifyList = model.formatCps(response.data)
        } else {
          this.classifyList = []
        }
      })
    },
    toggleListStatus(isShow) {
      this.showList = isShow
    },
    productSelect(index) {
      if (this.cropIndex !== index) {
        this.closeClassifyLayer()
        this.cropIndex = index

        this.renderProductInfo(index)
      }
    },
    renderProductInfo(index) {
      this.description = this.cropList[index].desc
      this.imageUrlList = this.cropList[index].imageUrl
      this.$emit('sendImageList', this.imageUrlList)

      var surId = this.cropList[index].surId
      this.getSurtableInfo(surId)
    },
    getSurtableInfo(surId) {
      request.suitabilityById(surId).then((response) => {
        if (response && response.status === 200 && response.data.status === 0) {
          var formated = model.formatSurInfo(response.data.data),
            cropId = formated.cropId,
            cropName = this.cropName = formated.cropName,
            code = formated.code

          this.layerList = formated.srList
          // this.$emit('changeProduct', {cropName, cropId, surId, code})

          if (!this.startGroup) {
            this.timeInterval = setInterval(()=> {
              this.groupingElement(formated.srList, {cropName, cropId, surId, code})
            }, 10)
          } else {
            this.groupingElement(formated.srList, {cropName, cropId, surId, code})
          }
        }
      })
    },
    groupingElement(srList, cropInfo) {
      if (this.startGroup) {
        if (this.timeInterval) {
          clearInterval(this.timeInterval)
          this.timeInterval = null
        }

        this.eleLists = []
        this.eleGroup = []
        this.currentLayerName = ''
        for (var i = 0; i < this.groupInfo.length; i++) {
            
          for (var j = 0; j < srList.length; j++) {
            if (srList[j].id === this.groupInfo[i].id) {
              this.eleLists.push(this.groupInfo[i])

              if (this.groupInfo[i].tag === "result") {
                this.resultId = this.groupInfo[i].id

                this.currentLayerName = srList[j].layerName
                this.currentExtend = srList[j].extend
              }

              if (this.eleGroup.indexOf(this.groupInfo[i].group) < 0 && this.groupInfo[i].group) {
                this.eleGroup.push(this.groupInfo[i].group)
              }
            }
          }
        }

        this.changeEleGroup(0)
        this.addComprehenseLayer(cropInfo)
        this.$emit('elementList', this.eleLists)
      }
    },
    hideEleSlider() {
      this.showEleSlider = false
      this.currentIndex = 0;
      this.eleIndex = -1

      this.addLayerByName(this.currentLayerName, this.currentExtend)
    },
    changeEleGroup(index) {
      this.currentIndex = index;
      this.eleIndex = -1
      this.filteredEle = []
      for (var i = 0; i < this.eleLists.length; i++) {
        if (this.eleLists[i].group === this.eleGroup[index]) {
          this.filteredEle.push(this.eleLists[i])
        }
      }
    },
    addComprehenseLayer(cropInfo) {
      this.$emit('closeDetail')
      this.addLayerByName(this.currentLayerName, this.currentExtend, cropInfo)
    },
    addLayerByName(layerName, extend, cropInfo) {
      if (layerName === this.currentLayerName) {
        this.$emit('getElementId', this.resultId)
      }

      var opacity = this.opacity / 100
      this.$emit('changeLayer', {layerName, opacity, extend, cropInfo})
    },
    changeOpacity(opacity) {
      this.opacity = opacity
      if (this.currentLayer) {
        this.currentLayer.setOpacity(opacity/100)
      }
    },
    changeClassifyOpacity(opacity) {
      this.classifyOpacity = opacity
      if (this.classifyLayer) {
        this.classifyLayer.setOpacity(opacity/100)
      }
    },
    downloadImage() {
      this.imageUrl && elementUtil.downLoad(this.imageUrl)
    },
    downloadPdf() {
      this.pdfUrl && elementUtil.downLoad(this.pdfUrl)
    },
    chooseClassify(id) {
      if (id && id != -1) {
        this.cfListLoading = true
        this.showPopMsg('加载中，请稍后...')
        request.distributeById(id).then((response) => {
          if (response.status !== 200 || response.data.status !== 0) {
            this.noClassifyData = true
          } else {
            var formated = model.formatCpData(response.data.data[id], this.code)
            if (!formated) {
              this.noClassifyData = true
            } else {
              this.noClassifyData = false

              this.tableData = this.getCpCrops(formated)
              
              this.setSldAttr(formated.cp, id)

              var classifyLayerName = formated.cp.id
              this.addClassifyLayer(classifyLayerName, formated.cp.crops)
              this.currentClassify = true
              if (this.filteredCflist[0].only_result !== -1) {
                this.filteredCflist.unshift({title: "取消叠加", only_result: -1})
              }

              this.$nextTick(() => {
                this.scrollToBottom()
              })
            }
          }
          this.cfListLoading = false
        })
      } else if (id === -1) {
        this.filteredCflist.shift()
        this.closeClassifyLayer()
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
    getCpCrops(data) {
      for (let i = 0; i < data.cp.crops.length; i++) {
        data.cp.crops[i].open = true
        data.cp.crops[i].i = i + 1;
        data.cp.crops[i].color = this.layerSld.normal[i];
        data.cp.crops[i].area = (Number(data.cp.crops[i].a) / 10000 / 10000 * 15).toFixed(2);
      }
      return data.cp.crops
    },
    scrollToBottom() {
      var dom = document.getElementsByClassName('crop-list-bg')[0]
      var scrollHeight = dom.scrollHeight - dom.offsetHeight

      this.scrollTimeHandler = setInterval(() => {
        if (dom.scrollTop < scrollHeight) {
          dom.scrollTop += 25

        } else {
          clearInterval(this.scrollTimeHandler)
        }
      }, 10)
    },
    closeClassifyLayer() {
      if (this.classifyLayer) {
        this.tableData = []
        this.currentClassify = false
        this.$emit('removeClassifyLayer')
        this.showPopMsg('已隐藏所选分布图层')
      }
    },
    addClassifyLayer(layerName, crops) {
      var opacity = this.classifyOpacity / 100
      this.$emit('addClassifyLayer', {layerName, opacity, crops})
      this.showPopMsg('已显示所选分布图层')
    },
    eleClick(index) {
      this.eleIndex = index
      for (var i = 0; i < this.layerList.length; i++) {
        if (this.layerList[i].id === this.filteredEle[index].id) {
          
          this.$emit('getElementId', this.layerList[i].id)

          this.showPopMsg(`图层已切换至${this.filteredEle[index].name}适宜图层`)
          this.addLayerByName(this.layerList[i].layerName, this.layerList[i].extend)
          break
        }
      }
    },
    showPopMsg(title) {
      this.$refs['popMessage'].showDialog()
      this.popTitle = title
    },
    setLayerVisible({id, open, name}) {
      var index = this.getIndexById(id)
      var layerSld = this.layerSld
      this.tableData[index].open = open
      
      var opacity = open ? 1 : 0
      this.$emit('setLayerVisible', {id, opacity, name, layerSld})
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
      var opacity = 1
      var layerSld = this.layerSld

      this.$emit('setLayerColor', {id, color, opacity, layerSld})

      this.cropIndex = this.getIndexById(id)
      this.tableData[this.cropIndex].color = color
      this.tableData[this.cropIndex].open = true
    },
    getEchart(){
      this.cropHeathOption = echart.getPie(this.cropFit)
    },
    getTreeNode(data){
      this.toParentTreeData = data
    },
    treeConfirm(data){
      if (this.toParentTreeData === '全部区域') {
        this.emitTreeClickEvent(this.treeData[0])
      }else{
        this.emitTreeClickEvent(this.toParentTreeData)
      }
    },
    loopData(list) {
      var treeData = []
      var item = {}
      for (var i = 0; i < list.length; i++) {
        item = {
          area_id: list[i].area_id,
          area_name: list[i].area_name,
          bounds: model.formatBounds(list[i]),
          grade: list[i].grade,
          parent_id: list[i].parent_id
        }

        if (list[i].contain) {
          item.contain = this.loopData(list[i].contain)
        }

        treeData.push(item)
      }
      return treeData
    },
    filterClassifyList(code) {
      if (this.classifyCodes.length > 0) {
        this.setClassifyList(code)

      } else {
        this.fetchRelation(code, this.classifyList)
      }
    },
    fetchRelation(code, list) {
      var codes = []
      let params = {
        arealist: []
      }
      for (let i = 0; i < list.length; i++) {
        codes.push(list[i].area_code)

        let item = {
          area_code: list[i].area_code,
          grade: 5
        }
        params.arealist.push(item)
      }
      if (params.length > 0) {
        this.cfListLoading = true
        request.areaRelation(params).then((response) => {
          if (response && response.status === 200 && response.data.status === 0) {
            this.classifyCodes = model.formatRelation(response.data.data, codes)
            
            this.setClassifyList(code)
          }
          this.cfListLoading = false
        })
      } else {
        this.classifyCodes = []
        this.setClassifyList(code)
        this.cfListLoading = false
      }
    },
    setClassifyList(code) {
      this.filteredCflist = []
      if (code === this.TREE_ROOT_CODE) {
        this.getRealCodes()

      } else {
        for (var i = 0; i < this.classifyList.length; i++) {
          var existCode = this.classifyCodes[this.classifyList[i].area_code]
          if (existCode.includes(code)) {
            this.filteredCflist.push(this.classifyList[i])
          }
        }
      } 
    },
    getRealCodes() {
      var realNode = this.treeData[0].contain
      for (var i = 0; i < realNode.length; i++) {
        this.setClassifyList(realNode[i].area_id)
      }
    },
    emitTreeClickEvent(node) {
      var code = node.area_id
      if (code === this.TREE_ROOT_CODE) {
        this.areaName = '所选区域'
        this.description = this.cropList[this.cropIndex].desc 
        
      } else {
        this.areaName = node.area_name
        this.description = this.areaName + "种植适宜性规划"
      }
      var parentCode = node.parent_id
     
      this.filterClassifyList(code)
      this.imageUrl = this.imageUrlList[code]

      this.$emit('treeClickEvent', node)
    },
    changeLoadOpacity(color) {
      setTimeout(()=> {
        var dom = document.getElementsByClassName('el-loading-mask')
        elementUtil.setDomStyle(dom, 'backgroundColor', color)
      })
    }
  },
  watch: {
    cropList(list) {
      if (list && list.length > 0) {
        this.productSelect(0)
      }
    },
    showEleSlider(show) {
      if (this.showList) {
        if (show) {
          this.sliderAnimateClass = 'plant-animation-out-left'
        } else {
          this.sliderAnimateClass = 'plant-animation-in-left'
        }
      }
    },
    treeList(list){
      if(list && list.length > 0){
        this.toParentTreeData = '全部区域'
        this.treeData = list

        this.emitTreeClickEvent(this.treeData[0])
      }
    },
    cropFit(list) {
      if (list && list.length > 0) {
        this.getEchart()
      }
    },
    loading(loading) {
      if (!loading) {
        this.firstLoad = false
      }
    },
    firstLoad(loading) {
      if (!loading) {
        this.changeLoadOpacity("rgba(255,255,255,.9)")
      }
    },
    hideTreeStatus(status){
      this.areaShowTree = false
      this.$emit('initTreeStatus',true)
    }
  },
  destroyed() {
    this.loading = false
  },
  components: {
    leftTab,
    tbDetail,
    expectData,
    tree
  }
}
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/common';
@value: 100%;
.pl-opacity {
  padding-top: 6px;
  padding-left: 16px;
  background: @assistant-bg;
}
.product-list { 
  .crop-list-bg {
    width: 100%;
    min-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    .adv-border-bottom-radius();

    .crop-list {
      .btns-con {
        margin: 0;
        padding: 10px 16px 0;
        background: #f3fbeb;
        border-bottom: 1px solid #dcdcdc;
      }
    }
    .crop-desc-container{
      padding: 12px 16px 0px;
      box-sizing: border-box;
      background: #f3fbeb;
      border-bottom: 1px solid #dcdcdc;
      .crop-desc {
        .adv-text-line-height-normal();
        .adv-font-normal();
      }
      .show-affector {
        text-align: right;
        padding: 0 8px 12px 0;
        span {
          .adv-normal-primary-btn();
          line-height: 13px;
          i {
            font-size: 12px;
            margin-left: 4px;
          }
        }
      }
    }
    .area-tree {
      padding: 14px;
    }

 .fit-classfication-area {
    line-height: normal;
    background: @assistant-bg;
    padding: 0px 14px;
    border-bottom: 1px solid @border-color;
    .clssfication-information-btn{
      .adv-normal-primary-btn();
      position: absolute;
      top: 12px;
      right: 29px;
    }
    .fit-container{
      .adv-border-normal();
      .adv-boxshadow-soft();

      padding: 20px 14px 14px;
      background: #fafafa;
      margin-bottom: 15px;
      .fit-classfication-area-title {
        .adv-title-after-vertical-line-normal();
        line-height: 28px;
      }
      .legend {
        padding: 22px 0 20px 0;
        margin-left: -11px;
        li {
          float: left;
          margin-left: 11px;
          padding: 2px 3px;
          border: 1px solid @border-color;
          border-radius: 2px;
        }
      }
      .fit-classfication-area-echart-bg {
        width: 100%;
        height: 160px;
        .fit-echart {
          width: 300px;
          height: 160px;
          margin: auto;
        }
      }
    }
    
 }
  }
  .download-bg {
    background: @assistant-bg;
    .adv-border-bottom-radius();
    
    .download-btns {
      line-height: 1;
      .adv-gradient(#f1f4f4;#f0f5f4);
      border-top: 1px solid #dcdcdc;
      border-bottom: 1px solid #dcdcdc;
      p {
        width: 49%;
        position: relative;
        font-size: 14px;
        display: inline-block;
        padding: 15px 0px;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        em {
          display: none;
        }
        .no-file {
          color: #9d9d9d;
        }
        &:hover {
          i,span {
            display: none;
          }
          em {
            color: #5e8a00;
            display: inline-block;
          }
        }
        &:first-child:after {
          position: absolute;
          right: 0;
          top: 0px;
          content: '';
          height: 46px;
          width: 1px;
          background: #dcdcdc;
        }
        i {
          font-size: 15px;
          margin-right: 6px;
          color: #6f6f6e;
        }
      }
    }
  }
  .drop-down-menu {
    width: 95%;
    margin-bottom: 10px;
  }
  .overlay-classify {
    padding-left: 16px;
    padding-bottom: 4px;
    h3 {
      font-size: 14px;
      line-height: 45px;
    }
    p {
      text-align: center;
    }
  }
  .overlay-classify-no-data {
    padding-left: 16px;
    h3 {
      font-size: 14px;
      line-height: 14px;
      margin-top: 16px;
    }
    p {
      font-size: 14px;
      color: #b9b8b8;
      line-height: 14px;
      margin: 16px 0 0;
      text-align: center;
      padding-bottom: 16px;
      .noProduct{
        margin-left: 6px;
      }
    }
  }
  .overlay-classify-loading {
    padding-left: 16px;
    h3 {
      .adv-title-normal();
      line-height: 14px;
      margin-top: 16px;
    }
    p {
      .adv-text-line-height-normal();
      text-align: center;
    }
  }
  .element-slider {

    width: 0px;
    position: absolute;
    top: 0px;
    z-index: 10002;
    margin-left: -10px;
    .popup-header {
      .adv-border-normal();
      .adv-boxshadow-soft();
      overflow: hidden;
      height: 140px;
      margin: 0 10px;
      background: @assistant-bg;
      .popup-header-title {
        .adv-title-normal();
        padding-left: 18px;
        line-height: 36px;
        background: #f3fbeb;
        border-bottom: 1px solid #dcdcdc;
        .close {
          width: 90px;
          right: 8px;
          top: 0px;
          text-align: right;
          cursor: pointer;
          span {
            margin-right: 2px;
          }
              &:hover {
              span {
                display: none;
              }
              .back-result {
                display: block;
              }
            }
          .back-result {
            font-size: 12px;
            display: none;
            color: #5c8704;
            height: 36px;
            i {
              font-size: 12px;
              margin-right: 4px;
            }
          }
        }
      }
      .ele-group {
        overflow: hidden;
        border-bottom: 1px solid #dcdcdc;
        .active {
          color: #9ed132;
          border-bottom: 3px solid #9ed132;
        }
        li {
          font-size: 14px;
          padding: 10px 14px;
          margin-left: 12px;
          border-bottom: 3px solid #fff;
          cursor: pointer;
        }
      }
    }
    .element-item {
      margin-top: 12px;
      padding-left: 10px;
    }
  }
}
@keyframes faderight {
   0% {
      left: 10px;
      width: @value;
      display: block; 
     }
    100% {
      left: @value;
      width: 0px;
      height: 140px;
      display: none;
      height: 140px;
      overflow: hidden;
    }
  }
.plant-animation-in-left {
  .adv-animation(faderight;.38s;1;forwards)
}
@keyframes fadeleft {
    0% {
      left: @value;
      width: 0px;
      height: 140px;
      display: none;
      height: 140px;
      overflow: hidden;
    }
    100% {
      left: 10px;
      width: @value;
      display: block;
    }
  }
.plant-animation-out-left {
  .adv-animation(fadeleft;.38s;1;forwards)
}
.plant-list-expect {
  color: #496b01;
  background: @assistant-bg;
  z-index: 10000;
  position: absolute;
  width: 100%;
  padding: 86px 0;
  text-align: center;
  border-radius: 0px 0px 4px 4px;
  i {
    font-size: 44px;
    display: block;
    color: #c1de84;;
  }
}
</style>
