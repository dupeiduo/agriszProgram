<template>
  <div class="scale-atbottom plant">
    <my-map class="map" 
      v-loading.body="mapLoading"
      @initMap="initMap" 
      background="#31c37c"
      :top="120"
      :addTileAreas="{code: code, areas: tree}" ref="map"></my-map>
    <div class="my-mapctl"
      :class="showList ? 'an-toright' : 'an-toleft'">
      <el-tooltip class="item-map" effect="light" :content="!showVec ? '地图' : '卫星'" placement="right">
        <span class="layer-ctl text-shadow-common"
          @click="showVec = !showVec">
          <img 
            v-if="!showVec"
            class="img-layer" src="static/assets/img/map/map.png" width="30px">
          <img
            v-if="showVec" 
            class="vec-layer" src="static/assets/img/map/vec.png" width="30px">
        </span>
      </el-tooltip>
      <el-tooltip class="item-center" effect="light" content="置中" placement="right">
        <span class="center-ctl" @click="setCenter"><i class="iconfont icon-dingwei center-to"></i></span>
      </el-tooltip>
    </div>

    <left-tab
      :showList="showList"
      @toggleList="toggleListStatus"
      :leftTab="listData"
      :title="title"
      :onlyList="true"
      @clickMenu="clickMenu">
      <div slot="list" class="list">
        <div class="crop-container">
          <div class="crops">
            <span class="fl line24">选择作物种类</span>
            <my-button class="btns-con"
              :buttons="buttons"
              :curIndex="btnIndex"
              @btnClick="btnClick"
              ></my-button>
          </div>

          <div class="block slider-container">
            <opacity-ctl 
              :opacity="cropOpacity"
              @changeOpacity="changeOpacityCrop"
              ></opacity-ctl>
          </div>
        </div>
        
        <div class="classify">
          <div class="switch-container">
            <span>叠加分布图层</span>
            <el-switch class="switch"
              :width=56
              v-model="showClassify"
              on-color="#8fc31f"
              off-color="#95adc4"
              on-text="显示"
              off-text="关闭">
            </el-switch>
          </div>
          <div class="block slider-container">
            <opacity-ctl 
              :opacity="classifyOpacity"
              @changeOpacity="changeOpacityClassify"
              ></opacity-ctl>
          </div>
        </div>

        <div class="classify">
          <div class="switch-container">
            <span>查看参数</span>
          </div>
          <div class="block slider-container">
            <opacity-ctl 
              :opacity="paramOpacity"
              @changeOpacity="changeOpacityParam"
              ></opacity-ctl>
          </div>
        </div>

        <toggle-list 
          :list="paramList"
          @showLayer="showLayer"
          @toggleMe="toggleMe"></toggle-list>
      </div>
    </left-tab>

    <el-dialog v-model="showHelp" size="large" class="help-dialog">
      <div class="help-content">
        <h3>查看原理</h3>
        <p>土地适宜性评价是针对某种特定的用途而对区域土地资源质量的综合评定。土地适宜性评价是土地高效、优化利用的基础评价。本方案基于GIS空间分析，综合运用主成分分析法、AHP层次分析法、隶属函数模型及模糊综合评判法，建立农作物种植适宜性综合评价模型，进行土地适宜性评价，通过对单因素进行适宜性等级评价，结合各要素权重，综合划分出农作物种植的适宜性等级，优化当前农作物的种植布局，为农作物种植提供科学的依据，避免盲目种植带来的损失。具体方案流程图如下 : </p>
        <img class="help-content-img" src="/static/assets/img/planting/help-img.png">
      </div>
    </el-dialog>

    <div class="sutable-result">
      <div class="legend">
        <span v-for="item in legend">
          {{item.name}}
          <i :style="{background: item.color}"></i>
        </span>
      </div>

      <div v-if="seeDetail">
        <div class="sutable-result-detail pr">
          <span class="btn-close" @click="seeDetail = false">×</span>
          <p class="sutable-degree">
            经度<span class="lon">{{lon}}</span>
            纬度<span class="lat">{{lat}}</span>
          </p>
          <p class="current-adress">
            <i class="current-map"></i>
            <i class="adress-name">{{addressName}}</i>
          </p>

          <p class="componet">
            <span>评价</span>
            <span class="stars">
              <i class="iconfont icon-xingxing" 
                v-for="item in stars"
                :style="{color: item ===1 ? '#8fc31e' : '#dcdcdc'}"></i>
            </span>
            <span class="sutable-level">{{suitTxt}}</span>
          </p>
        </div>
        <div class="show-detail">
          <span @click="showDetail = !showDetail">
            查 看 详 情 <i :class="showDetail ? 'triangle-top' : 'triangle-bottom'"></i>
          </span>
        </div>

        <div class="address-detail"
          v-if="showDetail">
          <p class="sutable-params-title">参数</p>

          <ul class="params-detail">
            <li class="params-li" v-for="item in paramList">
              <h3 class="fl">{{item.name}}</h3>
              <ul>
                <li v-for="param in item.child">
                  {{param.name}}
                  <span>{{param.suitTxt}}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <footer-lite></footer-lite>
  </div>
</template>

<script>
  import request from 'api/request.js'
  import model from 'api/model.js'
  import leftTab from 'components/leftTab'
  import configData from '../../config/data.js'
  import toggleList from './togglelist/'
  import config from 'config/env/config.env.js'
  import mapctl from './map/index.js'
  import {elementUtil} from 'plugins/utils.js'
  import footerLite from 'components/footerlite'

  export default{
    data(){
      return {
        map: null,
        tree: [],
        code: null,
        bounds: [],
        extent: null,
        listData: [
          {name: '帮助'}, 
          {name: '下载'}],
        title: '适宜性分布结果',
        buttons:[],
        btnIndex: -1,
        cropOpacity: 100,
        classifyOpacity: 100,
        paramOpacity: 100,
        showClassify: false,
        cropLayer: null,
        classifyLayer: null,
        paramLayer: null,
        paramList: [],
        filePath: '',
        legend: [],
        showHelp: false,
        layerInfo: null,
        showSuitInfo: false,
        showVec: true,
        lon: '',
        lat: '',
        suitTxt: '',
        seeDetail: false,
        showDetail: false,
        paramList: [],
        stars: [],
        showList: true,
        mapLoading: true,
        addressName: ''
      }
    },
    mounted() {
      request.cantonTree().then((response) => {
        if (response && response.status === 200) {
          this.tree = response.data
          this.code = response.data[0].area_id
          this.bounds =  model.formatBounds(response.data[0])
          this.extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
          this.setCenter()
          this.btnIndex = 0
          this.mapLoading = false
        }
      })

      this.map.addEventListener("click", (e) => {
        this.pointSutInfo(e.coordinate);
        this.showSuitInfo = true
        this.seeDetail = true
      });
      var targ = document.getElementsByClassName('ol-zoom')[0]
      targ.className = 'ol-zoom ol-unselectable ol-control an-toright'
      this.paramList = this.getList()
      this.legend = configData.plant.sutable
      this.buttons = configData.plant.cropList
    },
    methods: {
      initMap (map) {
        this.map = map;
      },
      changeOpacityParam(value) {
        this.paramOpacity = value
        if (this.paramLayer && typeof value === "number") {
          this.paramLayer.setOpacity(value/100)
        }
      },
      changeOpacityClassify(value) {
        this.classifyOpacity = value
        if (this.classifyLayer && typeof value === "number") {
          this.classifyLayer.setOpacity(value/100)
        }
      },
      changeOpacityCrop(value) {
        this.cropOpacity = value
        if (this.cropLayer && typeof value === "number") {
          this.cropLayer.setOpacity(value/100)
        }
      },
      setCenter() {
        this.map.getView().fit(this.extent, this.map.getSize());
      },
      toggleListStatus(isShow) {
        this.showList = isShow;
        if (isShow) {
          var targ = document.getElementsByClassName('ol-zoom')[0]
          targ.className = 'ol-zoom ol-unselectable ol-control an-toright'
        } else {
          var targ = document.getElementsByClassName('ol-zoom')[0]
          targ.className = 'ol-zoom ol-unselectable ol-control an-toleft'
        }
      },
      clickMenu(index) {
        if (index == 1) {
          elementUtil.downLoad(this.filePath)
        } else {
          this.showHelp = true
        }
      },
      btnClick(index) {
        this.btnIndex = index
        this.closeOther('closeAll')
      },
      getList() {
        this.paramList = configData.plant.params
        let paramList = []
        for (var i = 0; i < this.paramList.length; i++) {
          paramList[i] = {}
          paramList[i].name = this.paramList[i].name
          paramList[i].child = this.paramList[i].child
          paramList[i].open = false
        }
        return paramList
      },
      showLayer(item) {
        this.closeOther(item)
        if (item.show) {
          this.addParamLayer(item.value)
        } else {
          this.showCropLayer(true)
        }
      },
      toggleMe(item) {
        this.paramList[item.index].open = item.open
      },
      closeOther(item) {
        for (var p = 0; p < this.paramList.length; p++) {
          for (var i = 0; i < this.paramList[p].child.length; i++) {
            if (!item.show && this.paramList[p].child[i].value == item.value) {
              this.paramList[p].child[i].show = false
              return
            } else {
              if (this.paramList[p].child[i].value == item.value) {
                this.paramList[p].child[i].show = true
              } else {
                this.paramList[p].child[i].show = false
              }
            }
          }
        }
      },
      addCfLayer() {
        if (this.classifyLayer) {
          this.classifyLayer.setVisible(true)
        } else {
          let layerName = 'map:SCP_2016-12-01_451229_1484098552745'
          let options = {
            serverUrl: config.mapUrl,
            visible: true,
            extent: this.extent,
            layerName: layerName,
            sld: this.getCfSld(layerName, this.buttons[this.btnIndex].value),
            zIndex: 3
          }
          this.classifyLayer = this.$refs['map'].addGeoLayer(options, this.map)
        }
      },
      getCfSld(layerName, crop) {
        var params = setSldParams(crop);    
        
        function setSldParams(crop) {
          let result = {}
          if (crop == 135) {  // shuidao
            result.sdopacity = "1";
            result.gzopacity="0";
            result.ymopacity="0";
          } else if (crop == 131) {  // ganzhe
            result.gzopacity="1";
            result.ymopacity="0";
            result.sdopacity = "0";
          } else if (crop == 134) {  //yumi
            result.ymopacity="1";
            result.sdopacity = "0";
            result.gzopacity="0";
          }
          return result;
        }
        var _sld = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">'+
        '<NamedLayer><Name>'+ layerName +'</Name><UserStyle><Title>SLD Cook Book: Discrete colors</Title><FeatureTypeStyle><Rule><RasterSymbolizer><ColorMap type="values"><ColorMapEntry color="#000000" quantity="0" label="no-data" opacity="0" />'+
        '<ColorMapEntry color="#f19724" quantity="201" label="核桃" opacity="'+ params.sdopacity +'" /><ColorMapEntry color="#f19724" quantity="117" label="甘蔗" opacity="'+ params.gzopacity +'" /><ColorMapEntry color="#f19724" quantity="134" label="玉米" opacity="'+ params.ymopacity +'" /></ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
        
        return _sld;   
      },
      addCropLayer(crop) {
        this.map.removeLayer(this.cropLayer)
        this.cropLayer = null
        this.showCropLayer(true)

        let code = this.code,
          options = {code, crop}

        request.sutResultInfo(options).then((response) => {
          if (response.status != 200 || response.data.status != 0) {
            console.log(data.error_msg);
          } else {
            this.layerInfo = response.data.data
            let layerName = "map:" + this.layerInfo.result.layer_name,
              opacity = this.cropOpacity / 100
            this.cropLayer = this.addLayerByName(layerName, opacity)
          }
        })
      },
      addParamLayer(param) {
        this.map.removeLayer(this.paramLayer)
        this.paramLayer = null
        this.showCropLayer(false)
        let layerName = "map:" + this.layerInfo[param].layer_name,
          opacity = this.paramOpacity / 100
        this.paramLayer = this.addLayerByName(layerName, opacity)
      },
      showCropLayer(isTrue) {
        if (this.cropLayer) 
          this.cropLayer.setVisible(isTrue)
        if (this.paramLayer) 
          this.paramLayer.setVisible(!isTrue)
      },
      addLayerByName(layerName, opacity) {
        let sld = mapctl.getSld(layerName, this.legend),
          options = {
            serverUrl: config.mapUrl,
            visible: true,
            opacity: opacity ? opacity : '1',
            extent: this.extent,
            layerName: layerName,
            sld: sld,
            zIndex: 2
          }
        return this.$refs['map'].addGeoLayer(options, this.map)
      },
      pointSutInfo(coordinate) {
        let crop = this.buttons[this.btnIndex].value,
          code = this.code,
          lon = coordinate[0],
          lat = coordinate[1],
          options = { code, crop, lon, lat }
        request.pointSutInfo(options).then( (response) => {
          if (response.status == 200 && response.data.status == 0) {
            this.renderDetail(response.data.data);
          }
        });
        var lonlat = ol.proj.toLonLat([options.lon, options.lat]),
          params = { lon: lonlat[0], lat: lonlat[1] }
        request.tdtPoi(params).then((response) => {
          var formated = model.formatTdtPoi(response.data);
          
          let lon = formated.poi.location.lon,
            lat = formated.poi.location.lat
          
          this.lon = lon.toFixed(2)+'°'
          this.lat = lat.toFixed(2)+'°'
          this.pointLayer = mapctl.addPoint([lon, lat], this.map, this.pointLayer);
          if (formated.poi) {
            if (formated.poi.addressComponent.address) {
              this.addressName = formated.poi.addressComponent.address
            } else {
              this.addressName = formated.poi.addressComponent.poi
            }
          }
        });
      },
      renderDetail(data) {
        this.suitTxt = this.getSutContent(data.result.value)
        this.setStars(data.result.value)
        for (let i = 0; i < this.paramList.length; i++) {
          for (let j = 0; j < this.paramList[i].child.length; j++) {
            var key = this.paramList[i].child[j].value
            this.paramList[i].child[j].suitTxt = this.getSutContent(data[key].value)
          }
        }
        
      },
      setStars(value) {
        if (value == 1) {
          this.stars = [1,0,0,0,0]
        } else if (value == 2) {
          this.stars = [1,1,1,0,0]
        } else if (value >= 3) {
          this.stars = [1,1,1,1,1]
        } else {
          this.stars = [0,0,0,0,0]
        }
      },
      getSutContent(value) {
        if (value == -1) {
          return "无数据";
        }
        for (var i = 0; i < this.legend.length; i++) {
          if (this.legend[i].value == value) {
            return this.legend[i].name;
          }
        };
      }
    },
    watch: {
      btnIndex (index) {
        this.filePath = config.resourceUrl + this.buttons[index].filePath
        this.addCropLayer(this.buttons[index].value)
      },
      showClassify(show) {
        if (show) {
          this.addCfLayer()
        } else {
          this.classifyLayer.setVisible(false)
        }
      },
      showVec(showVec) {
        this.$refs['map'].showVec = showVec
      },
      seeDetail(isSeen) {
        if (!isSeen) {
          this.map.removeLayer(this.pointLayer)
        }
      }
    },
    components: {
      leftTab,
      toggleList,
      footerLite
    }
  }
</script>
<style lang="less" scoped>
  .plant {
    .my-mapctl {
      position: fixed;
      left: 331px;
      top: 0px;
      width: 36px;
      height: 72px;
      z-index: 2;
      margin-left: 10px;
      .item-map {
        position: fixed;
        top: 206px;
      }
      .item-center {
        position:fixed;
        top: 287px;
        border-bottom: 1px solid #eff0f2;
      }
      span {
        display: block;
        width: 36px;
        height: 36px;
        box-shadow: none;
        z-index: -1;
      }
      .center-ctl {
        display: block;
        background: #fff;
        color: #31c37c;
        i {
          font-size: 36px;
          cursor: pointer;
          line-height: 34px;
          width: 36px;
          height: 36px;
          border-bottom: 1px solid #eff0f2;
        }
      }
      .layer-ctl {
        display: block;
        cursor: pointer;
        text-align: center;
        background: #31c37c;
        img {
          margin: 3px;
        }
      }
    }
    .list {
      position: relative;
      background: #fff;
      margin: 0px 0 10px 0;
      .crop-container {
        width: 100%;
        border-bottom: 1px solid #d3d3d3;
        .crops {
          position: relative;
          width: 100%;
          height: 30px;
          padding: 10px 0 20px;
          span {
            margin: 0 10px;
          }
          .btns-con {
            height: 35px;
          }
        }
        
      }
      .classify {
        width: 100%;
        border-bottom: 1px solid #d3d3d3;
        .switch-container {
          width: 100%;
          padding: 10px 0;
          span {
            margin: 0 10px;
          }
          .switch {
            position: absolute;
            right: 20px;
          }
        }
      }
      .slider-container {
        width: 285px;
        margin: -5px 10px;
      }
    }
    .help-dialog {
      .help-content {
        h3 {
          font-size: 14px;
          margin: 5px 0;
        }
        p {
          line-height: 24px;
          text-indent: 2em;
          color: #6f6f6f;
        }
        img {
          display: block;
          width: 408px;
          height: 376px;
          margin: 10px auto;
        }
      }
    } 
  }
  .sutable-result {
    position: fixed;
    top: 64px;
    right: 0;
    width: 254px;
    border: 1px solid #ededed;
    border-radius: 0 0 4px 4px;
    background: #f1f4f4;
    box-shadow: 0 2px 8px #aeaeae;
    
    .legend {
      line-height: 38px;
      height: 38px;
      border-bottom: 1px solid #ededed;
      background: #fff;
      padding-left: 12px;
      span {
        vertical-align: middle;
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin: 0 16px 0 8px;
          border-radius: 2px;
        }
      }
    }

    .sutable-result-detail {
      width: 100%;
      margin-top: 8px;
      border-top: 1px solid #ededed;
      background: #fff;
      .btn-close {
        font-size: 22px;
        line-height: 16px;
        position: absolute;
        top: 4px;
        right: 10px;
        width: 20px;
        height: 20px;
        cursor: pointer;
        text-align: center;
        color: #999;
        border: 1px solid #eee;
        border-radius: 50%;
      }
      p {
        padding-left: 12px;
      }
      .sutable-degree {
        margin: 12px 0;
        color: #9c9c9c;
      }
      .current-adress {
        line-height: 30px;
        border-bottom: 1px solid #ededed;
        i {
          vertical-align: middle;
        }
        .current-map {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url(/static/assets/img/planting/pl-map.png) center center no-repeat;
        }
      }
      .componet {
        line-height: 40px;
        height: 40px;
        border-bottom: 1px solid #ededed;
        .stars {
          margin: 0 20px;
        }
      }
    }
    .show-detail {
      span {
        line-height: 34px;
        display: inline-block;
        width: 210px;
        height: 34px;
        margin: 18px 20px;
        cursor: pointer;
        text-align: center;
        border-radius: 6px;
        background: #c2e578;
        i {
          display: inline-block;
          width: 0;
          height: 0;
          margin: 10px 10px 0 0;
          border-right: 5px solid transparent;
          border-left: 5px solid transparent;
        }
        .triangle-top {
          border-bottom: 8px solid #959595;
        }
        .triangle-bottom {
          border-top: 8px solid #959595;
        }
      }
    }
    .address-detail {
      overflow-x: hidden;
      background: #f1f4f4;
      max-height: 434px;

      .sutable-params-title {
        font-size: 14px;
        line-height: 40px;
        padding-left: 12px;
      }
      .params-detail {
        .params-li {
          width: 100%;
          border-bottom: 1px solid #dcdcdc;
          padding-left: 12px;   
          float: left;
          h3 {
            width: 38px;
            margin-top: 12px;
            color: #a0a0a0;
          }
          ul {
            margin-top: 12px;
            float: left;
            li {
              margin-bottom: 14px;
              span {
                margin-left: 20px;
              }
            }
          }
        }
      }
    }
  }
</style>