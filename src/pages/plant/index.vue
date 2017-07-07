<template>
  <div class="plant" @click="hideTree">
    <my-map class="map"
      @initMap="initMap" 
      background="#fff"
      :top="97"
      borderRadius="4px"
      :switchCtl="true"
      :maxZoom="18" ref="map"
      :centerCtl="{use: true, bounds: offsetBounds}"
      :useTools="true">
    </my-map>

    <suitable-legend v-if="showLitte && !showDetail"></suitable-legend>
    <suitable-legend v-else-if="!showLitte"></suitable-legend>

    <product-list
      :loading="tabLoading"
      :cropList="cropList"
      :pdfUrl="pdfUrl"
      :currentLayer="currentLayer"
      :classifyLayer="classifyLayer"
      :treeList="areaTree"
      :cropFit="barOptions"
      :legend="barOptions"
      :barLoading="barLoading"
      :hideTreeStatus="hideTreeStatus"

      @setLayerColor="setLayerColor"
      @setLayerVisible="setLayerVisible"

      @changeLayer="changeLayer"
      @addClassifyLayer="addCfLayer"
      @removeClassifyLayer="removeCfLayer"
      @closeDetail="closeDetail"
      @elementList="elementList"
      @treeClickEvent="treeClickEvent"
      @getElementId="getElementId"
      @showAreaStats="showAreaStats"
      @sendImageList="sendImageList"
      @initTreeStatus="initTreeStatus"
      ></product-list>

    <popup-detail 
      :showLegend="showLitte"
      :legend="legend"
      :showMe="showDetail"
      :params="detailParams"
      :paramList="paramList"
      :cropName="cropName"
      :addressName="addressName"
      :addressLoading="addressLoading"
      @hideDetail="closeDetail"
      ></popup-detail>

    <!-- <my-searchpoi right="134px" :map="map" @setCenter="setCenter"></my-searchpoi> -->
    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
    <pop-tab 
      :tableData="tableData" 
      :showTab="showTab" 
      :currentIndex="currentIndex"
      :imageUrlList="imageUrlList"
      @closeTab="showTab = false"
      @sortArea="sortArea"
      @sortSuit="sortSuit"
      @sortGenSuit="sortGenSuit"
      @sortUnSuit="sortUnSuit"
      @dlSuitArea="dlSuitArea"
      ></pop-tab>
      <expect-data :showPageData="true" v-if="noMapData"></expect-data>
  </div>
</template>

<script>
import suitableLegend from './legend/index.vue'
import productList from './list/index.vue'
import popupDetail from './detail/index.vue'
import request from 'api/request.js'
import model from 'api/model.js'
import config from 'config/env/config.env.js'
import mapctl from './map/index.js'
import {elementUtil} from 'plugins/utils.js'
import configData from '../../config/data.js'
import popTab from './popTab/index.vue'
import {mapGetters} from 'vuex'
import expectData from 'components/expectData/'

  export default {
    data() {
      return {
        map: null,
        tree: [],
        areaTree: [],
        code: null,
        bounds: [],
        offsetBounds: [],
        extent: null,
        filter: ["451227", "451022"],
        buttons:[],
        tabLoading: true,
        firstLoad: true,

        cropList: [],
        pdfUrl: '',
        cropName: '',
        cropId: '',
        surId: '',

        detailParams: null,
        showDetail: false,
        lonlatStr: '',
        paramList: [],
        commentContent: '',

        currentLayer: null,
        classifyLayer: null,
        layerInfo: null,
        cfLayerInfo: null,

        addressLoading: false,
        addressName: '',
        pointLayer: null,

        showLitte: false,
        legend: null,

        popTitle: '',
        TREE_ROOT_CODE: 0,

        currentIndex: [],
        showTab: false,
        tableData: [],
        areaStatsCache: {},

        barLoading: true,
        barOptions: [],
        elementId: '',

        currentCode: '',

        clipGeom: '',

        imageUrlList: {},
        showPageData: false,
        noMapData: false,
        hideTreeStatus: false,
      }
    },
    mounted() {
      this.initProduct()
      this.initLegend()
      vueBus.$on('mapDrawHandler', this.mapDrawHandler)
    },
    computed: {
     ...mapGetters({
        menuWidth: 'menuWidth',
        getScreenHeight: 'getScreenHeight',
        screenWidth: 'screenWidth'
    })},
    methods: {
      showPopMsgUnAutoHide(msg) {
        this.$refs['popMessage'].showUnAutoHideDialog()
        this.popTitle = msg
      },
      hideTree(){
        this.hideTreeStatus = true
      },
      initTreeStatus(){
        this.hideTreeStatus = false
      },
      hidePopMsg() {
        this.$refs['popMessage'].hidePopMsgImmediate()
      },
      mapDrawHandler({maptool, ndvi}) {
      
        if(maptool) {
          this.map.un("click", this.mapClickHandler);

        } else {
          this.map.on("click", this.mapClickHandler);
        }
      },
      initMapParams(code, grade, layerInfo) {
        this.tabLoading = true
        this.changeLoadOpacity("rgba(255,255,255,1)")
        
        var params = this.getAreaParams(code, grade)
        
        request.getPartAreas(params).then((response) => {
          
          if (response.status !== 200 || response.data.status != '0') {
            console.log("接口返回:" + response.data.error_msg); 

          } else {
            this.tree = response.data.data
            this.areaTree = this.formatTree(response.data.data);
            this.bounds = model.combineBounds(response.data.data)
            this.offsetBounds = this.bounds
            this.fitToView(this.bounds)

            this.extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));

            this.setCenter()

            this.currentLayer = this.addLayer(layerInfo.layerName, layerInfo.opacity, layerInfo.extend)
            this.clipLayers(this.clipGeom)
            this.featchAreaData(this.surId)
          }
          
          this.tabLoading = false
          this.firstLoad = false
          this.hidePopMsg()
        })
          
      },
      formatTree(data) {
        var tree = [{
          area_id: this.TREE_ROOT_CODE,
          area_name: "全部区域",
          contain: this.loopData(data),
          parent_id: null,
          bounds: null
        }]
        return tree
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

          if (list[i].contain && list[i].contain.length > 0) {
            item.contain = this.loopData(list[i].contain)
          }

          treeData.push(item)
        }
        return treeData
      },
      getAreaParams(code, grade) {
        var params = {}
        params.arealist = []

        for (var i = 0; i < code.length; i++) {
          if (code[i]) {
            var area = { grade: grade, area_code: code[i] }
            params.arealist.push(area)
          }
        }

        return params
      },
      removeAreaLayer() {
        if (this.areaLayer) {
          this.map.removeLayer(this.areaLayer)
          this.areaLayer = null
        }
      },
      addAreaLayers(codes) {
        this.removeAreaLayer()

        this.areaLayer = this.$refs.map.getMultyAreaLayer(config.mapUrl, codes, this.bounds)
        this.map.addLayer(this.areaLayer)
      },
      getCodes(code, node) {
        var codes = [code]
        if (node.contain && node.contain.length > 0) {
          for (var i = 0; i < node.contain.length; i++) {
            codes.push(node.contain[i].area_id)
          }
        }
        return codes
      },
      initProduct() {
        this.tabLoading = true 
        this.showPopMsgUnAutoHide("图层加载中...")
        request.plantSur().then((response) => {
          if (response && response.status == 200 && response.data.status === 200) {
            var formated = model.formatSurProduct(response.data.data)
            
            this.cropList = formated.cropList
            this.pdfUrl = formated.pdfUrl

            this.tabLoading = false
            if (this.cropList.length === 0) {
              this.noMapData = true
              this.hidePopMsg()
            }else {
              this.noMapData = false
            }

          }else {
            this.noMapData = true
            this.hidePopMsg()
          }
        })
      },
      initLegend() {
        var clientH = document.documentElement.clientHeight || document.body.clientHeight;
        if (clientH < 800) {
          this.showLitte = true
        } else {
          this.showLitte = false
        }
        this.legend = configData.plant.sutable
      },
      initMap (map) {
        this.map = map;
      },
      setCenter() {
        this.$refs['map'].setCenter()
      },
      mapClickHandler(e) {
        var coordinate = e.coordinate

        this.renderDetailParams(coordinate)
        this.requestTdtPoi(coordinate)
      },
      renderDetailParams(coordinate) {
        var surId = this.surId,
          lon = coordinate[0],
          lat = coordinate[1]
        this.showDetail = true
        this.detailParams = { surId, coordinate }
      },
      requestTdtPoi(coordinate) {
        var lonlat = ol.proj.toLonLat(coordinate),
          params = { lon: lonlat[0], lat: lonlat[1] }

        this.pointLayer = mapctl.addPoint(coordinate, this.map, this.pointLayer);

        this.addressLoading = true
        request.tdtPoi(params).then((response) => {
          var formated = model.formatTdtPoi(response.data);
          if (formated) {
            if (formated.addressComponent.address) {
              this.addressName = formated.addressComponent.address
            } else {
              this.addressName = formated.addressComponent.poi
            }
          } else {
            // TODO no tdt data. Need desgin
            this.addressName = "暂无该地地名"
          }
          this.addressLoading = false
        })
      },
      addAreaAndLayer({layerName, opacity, extend, cropInfo}) {
        var layerInfo = {layerName, opacity, extend}

        this.cropName = cropInfo.cropName
        this.cropId = cropInfo.cropId
        this.surId = cropInfo.surId
        this.initMapParams(cropInfo.code, cropInfo.grade, layerInfo)
      },
      changeLayer({layerName, opacity, extend, cropInfo}) {
        if (cropInfo) {
          this.addAreaAndLayer({layerName, opacity, extend, cropInfo})

        } else {
          this.currentLayer = this.addLayer(layerName, opacity, extend)
          this.clipLayers(this.clipGeom)
        }
      },
      removeLayer() {
        if (this.currentLayer) {
          this.map.removeLayer(this.currentLayer)
          this.currentLayer = null
        }
      },
      addLayer(layerName, opacity, extend) {
        this.layerInfo = {layerName, opacity, extend}
        this.removeLayer()
        layerName = `map:${layerName}`

        var sld = mapctl.getSld(layerName, this.legend)
        
        var options = {
          serverUrl: config.mapUrl,
          visible: true,
          opacity: opacity ? opacity : '1',
          extent: extend,
          layerName: layerName,
          sld: sld,
          zIndex: 3
        }

        return this.$refs['map'].addGeoLayer(options, this.map)
      },
      removeCfLayer() {
        if (this.classifyLayer) {
          this.map.removeLayer(this.classifyLayer)
          this.classifyLayer = null
        }
      },
      addCfLayer({layerName,opacity, crops}) {
        this.cfLayerInfo = {layerName, opacity, crops}
        this.removeCfLayer()
        this.layerName = layerName = `map:${layerName}`

        let options = {
          serverUrl: config.mapUrl,
          visible: true,
          extent: this.extent,
          opacity: opacity ? opacity : '1',
          layerName: layerName,
          sld: this.getCfSld(layerName, crops),
          zIndex: 3
        }

        this.classifyLayer = this.$refs['map'].addGeoLayer(options, this.map)
        this.clipLayers(this.clipGeom)
      },
      getCfSld(layerName, crops) {
        var colors = configData.sld.cfLayerColors
        var cropsConfig = ''

        for (var i = 0; i < crops.length; i++) {
          cropsConfig = cropsConfig + `<ColorMapEntry color="${colors[i]}" quantity="${crops[i].id}" label="${crops[i].name}" opacity="1" />`
        }

        var _sld = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">'+
        '<NamedLayer><Name>'+ layerName +'</Name><UserStyle><Title>SLD Cook Book: Discrete colors</Title><FeatureTypeStyle><Rule><RasterSymbolizer><ColorMap type="values">'
          +'<ColorMapEntry color="#000000" quantity="0" label="no-data" opacity="0" />'
          + cropsConfig +
        '</ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
        
        return _sld;   
      },
      getSld(id, color, opacity, layerName, layerSld) {
        var sld = "";
        for (var i = 0; i < layerSld.id.length; i++) {
          if(layerSld.id[i] == id) {
            layerSld.color[i] = color ? color : layerSld.color[i];
            layerSld.opacity[i] = opacity;
          }
        
          sld += '<ColorMapEntry color="'+ layerSld.color[i] +
                    '" quantity="'+ layerSld.id[i] +
                    '" label="'+ layerSld.name[i] +
                    '" opacity="'+ layerSld.opacity[i] +
                  '" />';
        } 
        return this.appendSld(sld, layerName);
      },
      appendSld (sldBody, layerName) {
        return `<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"><NamedLayer>
          <Name>${layerName}</Name><UserStyle><Title>SLD Cook Book: Discrete colors</Title><FeatureTypeStyle><Rule><RasterSymbolizer><ColorMap type="values"><ColorMapEntry color="#000000" quantity="0" label="no-data" opacity="0" />
          ${sldBody}</ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>`;
      },
      setLayerVisible({id, opacity, name, layerSld}) {
        this.$refs['popMessage'].showDialog()
        this.popTitle = open ? `已显示${name}分布图层` : `已隐藏${name}分布图层`
        
        var curSld = this.getSld(id, null, opacity, this.layerName, layerSld)

        this.updateSld(curSld, this.classifyLayer);
      },
      setLayerColor({id, color, opacity, layerSld}) {
        var curSld = this.getSld(id, color, 1, this.layerName, layerSld)
        this.updateSld(curSld, this.classifyLayer);
      },
      updateSld(sld, layer) {
        layer.getSource().updateParams({SLD_BODY: sld});
      },
      closeDetail() {
        this.showDetail = false
        if (this.pointLayer) {
          this.map.removeLayer(this.pointLayer)
          this.pointLayer = null
        }
      },
      elementList(list) {
        this.paramList = list
      },
      featchAreaData(id) {
        if (id && this.areaStatsCache && !this.areaStatsCache[id]) {
          var params = {
            sur_ids: [id]
          }
          this.barLoading = true
          request.surAreaStats(params).then((response) => {
            if (response && response.status === 200 && response.data.status === 0) {
              this.areaStatsCache[id] = model.formatAreaStats(response.data.data)

            } else {
              this.areaStatsCache[id] = null
              console.log(`no surId is ${id}'s area statistics `)
            }
            this.barLoading = false
          })
        }
      },
      getElementId(id) {
        this.elementId = id
      },
      showAreaStats() {
        this.showTab = true
      },
      sendImageList(list) {
        this.imageUrlList = list
      },
      treeClickEvent(treeItem) {
        var code = treeItem.area_id
        this.offsetBounds = treeItem.bounds ? treeItem.bounds : this.bounds
        this.currentCode = code.toString()

        if (code === this.TREE_ROOT_CODE) {
          this.treeRootClicked()

        } else {
          this.treeNodeClicked(code)
        }
        
        var codes = this.getCodes(code, treeItem)
        this.addAreaLayers(codes)
      },
      treeRootClicked() {
        this.setBarByTreeroot()
        this.layerReAddBeforeClip()
        this.fitToView(this.bounds)
      },
      treeNodeClicked(code) {
        this.setBarByCode(code)
        this.getGeojsonThenClip(code)
        this.fitToView(this.offsetBounds)
      },
      setBarByTreeroot() {
        if (this.areaStatsCache[this.surId]) {
          var surStats = this.areaStatsCache[this.surId][this.elementId]
          var parentCodes = this.areaStatsCache[this.surId][this.elementId].parentCodes

          var area = [0, 0, 0]
          var percent = [0, 0, 0]
          
          this.setAreaPercent(parentCodes, area, percent, surStats)
          this.setTotalBarOptions(area, percent)

          this.highLightParentTableRow()
        } else {
          setTimeout(() => {
            this.setBarByTreeroot()
          }, 10)
        }
      },
      setBarByCode(code) {
        if (this.areaStatsCache[this.surId]) {

          if (this.areaStatsCache[this.surId][this.elementId][code]) {
            this.barOptions = [].concat(this.areaStatsCache[this.surId][this.elementId][code].bar)
            this.barOptions.reverse()
          }

          this.highLightTableRowByCode(code)
        } else {
          setTimeout(() => {
            this.setBarOptions(code)
          }, 10)
        }
      },
      setAreaPercent(parentCodes, area, percent, surStats) {
        for (var i = 0; i < parentCodes.length; i++) {
          for (var j = 0; j < area.length; j++) {
            if (surStats[parentCodes[i]] && surStats[parentCodes[i]].bar) {
              area[j] += parseInt(surStats[parentCodes[i]].bar[j].value)
            }
          }
        }

        var totalArea = area.reduce(((sum, item) => sum +item), 0)

        percent[0] = area[0] === 0 ? 0 : (area[0] / totalArea * 100).toFixed(0)
        percent[1] = area[1] === 0 ? 0 : (area[1] / totalArea * 100).toFixed(0)
        percent[2] = area[2] === 0 ? 0 : (area[2] / totalArea * 100).toFixed(0)
      },
      setTotalBarOptions(area, percent) {
        var sutable = configData.plant.sutable
        this.barOptions = []
        // 数据顺序为 不适宜 － 适宜
        for (var i = area.length - 1; i >= 0; i--) {
          var displayArea = area[i] >= 10000 ? ((area[i] / 10000).toFixed(2) + '万亩') : (area[i]+ '亩')
          var suitItem = {
            value: area[i],
            name:  `${sutable[i].name}\n${displayArea}`,
            color: sutable[i].color,
            displayName: sutable[i].name,
            percent: percent[i],
            background: sutable[i].background
          }
          this.barOptions.push(suitItem)
        }
        this.barOptions.reverse()
      },
      highLightParentTableRow() {
        var stats = this.areaStatsCache[this.surId][this.elementId]
        var formatedTbInfo = model.formatSurtStatsByTree(stats, this.tree)

        this.tableData = formatedTbInfo.tableData
        this.currentIndex = formatedTbInfo.parentIndexs
      },
      highLightTableRowByCode(code) {
        var stats = this.areaStatsCache[this.surId][this.elementId]
        var formatedTbInfo = model.formatSurtStatsByTree(stats, this.tree)
        
        this.tableData = formatedTbInfo.tableData
        this.currentIndex = this.getIndexByCode(code, this.tableData)
      },
      getIndexByCode(code, tableData) {
        var index = []
        for (var i = 0; i < tableData.length; i++) {
          if (tableData[i].id === code) {
            index[0] = i 
            break
          }
        }

        return index
      },
      sortArea(asc) {
        var result = 0
        var method 

        if (asc) {
          method = (cur, next) => cur.totalArea - next.totalArea
          
        } else {
          method = (cur, next) => next.totalArea - cur.totalArea
        }
        this.tableData.sort(method) 
        this.highLightAfterSort(this.currentCode, this.tableData)
      },
      sortSuit(asc) {
        var result = 0
        var method 

        if (asc) {
          method = (cur, next) => cur.suit.area - next.suit.area
          
        } else {
          method = (cur, next) => next.suit.area - cur.suit.area
        }
        this.tableData.sort(method) 
        this.highLightAfterSort(this.currentCode, this.tableData)
      },
      sortGenSuit(asc) {
        var result = 0
        var method 

        if (asc) {
          method = (cur, next) => cur.geSuit.area - next.geSuit.area
          
        } else {
          method = (cur, next) => next.geSuit.area - cur.geSuit.area
        }
        this.tableData.sort(method) 
        this.highLightAfterSort(this.currentCode, this.tableData)
      },
      sortUnSuit(asc) {
        var result = 0
        var method 

        if (asc) {
          method = (cur, next) => cur.unSuit.area - next.unSuit.area
          
        } else {
          method = (cur, next) => next.unSuit.area - cur.unSuit.area
        }
        this.tableData.sort(method) 
        this.highLightAfterSort(this.currentCode, this.tableData)
      },
      highLightAfterSort(code, tableData) {
        if (code == this.TREE_ROOT_CODE) {
          var codes = this.areaStatsCache[this.surId][this.elementId].parentCodes
          var indexs = []
          for (var i = 0; i < codes.length; i++) {
            indexs = indexs.concat(this.getIndexByCode(codes[i], tableData))
          }
          this.currentIndex = indexs

        } else {
          this.currentIndex = this.getIndexByCode(code, tableData)
        }
      },
      dlSuitArea() {
        var params = {
          surId: this.surId,
          fileName: "适宜性分级面积统计表",
          eleId: this.elementId
        }
        request.dlSuitStats(params)
      },
      getGeojsonThenClip(code) {
        this.layerReAddBeforeClip()
        if (code) {
          request.areaGeojson(code).then((response) => {
            if (response && response.status === 200 && response.data.status === 0) {
              this.clipGeom = response.data.data.geom
              this.clipLayers(response.data.data.geom)
            } else {
              console.log(`no code ${code}'s geojson`)
            }
          })
        } else {
          this.clipGeom = ''
        }
      },
      clipLayers(geom) {
        if (geom !== '') {
          geom = JSON.parse(geom)
          var clipedFs = mapctl.getClipFeature(geom)
          
          mapctl.clipLayer(this.currentLayer, clipedFs)

          if (this.classifyLayer) {
            mapctl.clipLayer(this.classifyLayer, clipedFs)
          }
          this.map.renderSync()
        }
      },
      layerReAddBeforeClip() {
        this.clipGeom = ''
        this.removeLayer()
        this.currentLayer = this.addLayer(this.layerInfo.layerName, this.layerInfo.opacity, this.layerInfo.extend)
        if (this.classifyLayer) {
          this.removeCfLayer()
          this.addCfLayer(this.cfLayerInfo)
        }
      },
      changeLoadOpacity(color) {
        setTimeout(()=> {
          var dom = document.getElementsByClassName('el-loading-mask')
          elementUtil.setDomStyle(dom, 'backgroundColor', color)
        })
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
      cropId(id) {
        if (id !== '') {
          this.map.on("click", this.mapClickHandler);
        } else {
          this.map.un("click", this.mapClickHandler);
        }
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
    destroyed() {
      this.map.un("click", this.mapClickHandler);
    },
    components: {
      suitableLegend,
      productList,
      popupDetail,
      popTab,
      expectData
    }
  }
</script>

<style lang="less" scoped>

</style>