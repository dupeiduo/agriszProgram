<template>
  <div class="product-list" v-loading.lock="loading">
    <left-tab
      :leftTab="[]"
      :showList="showList"
      @toggleList="toggleListStatus"
      :title="'种植适宜性规划'"
      >
      
      <div slot="list" class="crop-list-bg"  v-if="cropList.length > 0">
        <div class="crop-list">
          <my-button class="btns-con"
            :buttons="cropList"
            :curIndex="cropIndex"
            @btnClick="productSelect"
            ></my-button>
        </div>
        <div class="crop-desc">
          {{description}}
        </div>

        <div class="show-affector">
          <span @click="showEleSlider=true"><em>查看影响因素</em><i class="iconfont icon-icon-copy-copy"></i></span>
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
                  <em v-if="imageUrl" class="animated fadeInRight animation-time">点击下载</em>
                  <em v-else class="animated fadeInRight animation-time no-file">暂无</em>
              </p>
              <p @click="downloadPdf">
                  <i class="iconfont icon-xiazai1"></i>
                  <span>适宜性报告</span>

                  <em v-if="pdfUrl" class="animated fadeInRight animation-time">点击下载</em>
                  <em v-else class="animated fadeInRight animation-time no-file">暂无</em>
              </p>
            </div>

            <div v-if="classifyList.length > 0"
              class="overlay-classify">
              <h3>作物分布</h3>

              <el-select v-model="currentClassify" placeholder="请选择分布产品"
                v-loading.lock="cfListLoading"
                @change="chooseClassify" class="drop-down-menu">
                <el-option
                  v-for="(item, index) in classifyList"
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
        </div>

        <div class="element-slider"
          :class="sliderAnimateClass"
          >
          
          <div class="popup-header">
            <h3 class="popup-header-title pr">{{cropName}}
              <div class="close ps">
                  <span class="el-icon-close"></span>
                  <em class="back-result ps animated fadeInRight animation-time" @click="hideEleSlider"><i class="iconfont icon-icon-copy"></i>返回评价结果</em>
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


      <div v-else-if="!loading"  slot="list" class="plant-list-expect">
        <i class="iconfont icon-jingqingqidai-"></i>敬请期待
      </div>
      
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
import tbDetail from '../tbdetail';

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

      classifyList: [],
      currentClassify: '',
      cfListLoading: false,

      sliderAnimateClass: '',
      showEleSlider: false,
      selectedOptions: [],

      popTitle: '',

      currentIndex: -1,
      currentLayerName: '',
      currentExtend: [],

      tableData: [],
      layerSld: {}
    }
  },
  mounted() {
    this.initElementInfo()
    this.initClassify()
  },
  methods: {
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
      this.imageUrl = this.cropList[index].imageUrl

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
            var formated = model.formatCpData(response.data, id, this.code)
            if (!formated) {
              this.noClassifyData = true
            } else {
              this.noClassifyData = false

              this.tableData = this.getCpCrops(formated)

              this.setSldAttr(formated.cp, id)

              var classifyLayerName = formated.cp.id
              this.addClassifyLayer(classifyLayerName, formated.cp.crops)
              if (this.classifyList[0].only_result !== -1) {
                this.classifyList.unshift({title: "取消叠加", only_result: -1})
              }
            }
          }
          this.cfListLoading = false
        })
      } else if (id === -1) {
        this.classifyList.shift()
        this.currentClassify = ''
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
    closeClassifyLayer() {
      if (this.classifyLayer) {
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
        if (this.layerList[i].id === this.eleLists[index].id) {
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
    }
  },
  destroyed() {
    this.loading = false
  },
  components: {
    leftTab,
    tbDetail
  }
}
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/reset';
@value: 358px;
.animation-time {
  animation-duration: .34s;
   -webkit-animation-duration: .34s;
}
.pl-opacity {
  margin-top: 6px;
  padding-left: 16px;
}
.product-list {
  position: relative;
  top: 57px;
  left: 10px;
  width: 358px;
  height: 400px;
  .crop-list-bg {
    background: #f3fbeb;
    .mixin-border-radius-bottom();

    .crop-list {
      .btns-con {
        margin: 0;
        padding: 10px 16px 0;
       .mixin-borderline(0;0;1px;0);
      }
    }
    .crop-desc {
      line-height: 22px;
      padding: 12px 16px 16px;
    }
    .show-affector {
      text-align: right;
      padding: 0 18px 12px 0;
      .mixin-borderline(0;0;1px;0);
      span {
        padding: 8px 10px;
        background: #8ec122;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        &:hover { 
          background: #7eb902;
        }
        i {
          font-size: 12px;
          margin-left: 4px;
        }
      }
    }
  }
  .download-bg {
    background: #fff;
    .mixin-border-radius-bottom();
    
    .download-btns {
      line-height: 1;
      .mixin-gradient-bg(#f1f4f4;#f0f5f4);
      .mixin-borderline(1px;0px;1px;0);
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
    h3 {
      font-size: 14px;
      line-height: 45px;
    }
  }
  .element-slider { 
    width: 0px;
    position: absolute;
    top: 50px;
    z-index: 10002;
    margin-left: -10px;

    .popup-header {
      height: 140px;
      margin: 0 10px;
      background: #fff;
      border-radius: 4px;
      .mixin-boxshadow();
      overflow: hidden;
      .popup-header-title {
        font-size: 14px;
        padding-left: 18px;
        line-height: 36px;
        background: #f3fbeb;
        .mixin-borderline(0;0;1px;0);
        .close {
          width: 90px;
          left: 238px;
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
        .mixin-borderline(0;0;1px;0);
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
      display: block;    }
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
  .mixin-animation(faderight;.38s;1;forwards)
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
  .mixin-animation(fadeleft;.38s;1;forwards)
}
.plant-list-expect {
  color: #496b01;
  background: #fff;
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
