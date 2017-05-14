<template>
  <div class="plant">
    <my-map class="map plant-map" 
      @initMap="initMap" 
      background="#fff"
      :top="97"
      borderRadius="4px"
      :switchCtl="true"
      :maxZoom="20" ref="map"
      :centerCtl="{use: true, bounds: bounds}"
      :useTools="true"
      :addTileAreas="{code: null, areas: tree, extent: bounds}">
    </my-map>

    <suitable-legend v-if="showLitte && !showDetail"></suitable-legend>

    <product-list
      :loading="mapLoading"
      :cropList="cropList"
      :pdfUrl="pdfUrl"
      :currentLayer="currentLayer"
      :classifyLayer="classifyLayer"
      
      @setLayerColor="setLayerColor"
      @setLayerVisible="setLayerVisible"

      @changeLayer="changeLayer"
      @addClassifyLayer="addCfLayer"
      @removeClassifyLayer="removeCfLayer"
      @closeDetail="closeDetail"
      @elementList="elementList"
      ></product-list>

    <popup-detail 
      :showLegend="showLitte"
      :legend="legend"
      :showMe="showDetail"
      :params="detailParams"
      :paramList="paramList"
      :cropName="cropName"
      :addressName="addressName"
      @hideDetail="closeDetail"
      ></popup-detail>

    <my-searchpoi right="134px" :map="map" @setCenter="setCenter"></my-searchpoi>
    <pop-message :popTitle="popTitle" ref="popMessage"></pop-message>
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

  export default {
    data() {
      return {
        map: null,
        tree: [],
        code: null,
        bounds: [],
        extent: null,
        buttons:[],
        mapLoading: false,

        listLoading: false,
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

        addressName: '',
        pointLayer: null,

        showLitte: false,
        legend: null,
        popTitle: ''
      }
    },
    mounted() {
      this.initProduct()
      this.initLegend()
    },
    methods: {
      initMapParams(code, layerInfo) {
        this.mapLoading = true
        
        var params = this.getAreaParams(code)
        
        request.getPartAreas(params).then((response) => {
          
          if (response.status !== 200 || response.data.status != '0') {
            console.log("接口返回:" + response.data.error_msg); 

          } else {
            this.tree = response.data.data;
            this.bounds = model.combineBounds(response.data.data)

            this.extent = ol.extent.applyTransform(this.bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));

            this.setCenter()

            this.currentLayer = this.addLayer(layerInfo.layerName, layerInfo.opacity, layerInfo.extend)
          }
          
          this.mapLoading = false
        })
          
      },
      getAreaParams(code) {
        var params = {}
        params.arealist = []

        for (var i = 0; i < code.length; i++) {
          if (code[i]) {
            var area = { "grade": '0', "area_code": code[i] }
            params.arealist.push(area)
          }
        }

        return params
      },
      initProduct() {
        this.listLoading = true
        request.plantSur().then((response) => {
          if (response && response.status == 200 && response.data.status === 200) {
            var formated = model.formatSurProduct(response.data.data)
            
            this.cropList = formated.cropList
            this.pdfUrl = formated.pdfUrl

            this.listLoading = false
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

        request.tdtPoi(params).then((response) => {
          var formated = model.formatTdtPoi(response.data);
          if (formated) {
            let lon = formated.location.lon,
              lat = formated.location.lat

            this.pointLayer = mapctl.addPoint([lon, lat], this.map, this.pointLayer);
            
            if (formated) {
              if (formated.addressComponent.address) {
                this.addressName = formated.addressComponent.address
              } else {
                this.addressName = formated.addressComponent.poi
              }
            }

          } else {
            // TODO no tdt data
          }
            
        })
      },
      addAreaAndLayer({layerName, opacity, extend, cropInfo}) {
        var layerInfo = {layerName, opacity, extend}

        this.cropName = cropInfo.cropName
        this.cropId = cropInfo.cropId
        this.surId = cropInfo.surId
        this.initMapParams(cropInfo.code, layerInfo)
      },
      changeLayer({layerName, opacity, extend, cropInfo}) {
        if (cropInfo) {
          this.addAreaAndLayer({layerName, opacity, extend, cropInfo})

        } else {
          this.currentLayer = this.addLayer(layerName, opacity, extend)
        }
      },
      removeLayer() {
        if (this.currentLayer) {
          this.map.removeLayer(this.currentLayer)
          this.currentLayer = null
        }
      },
      addLayer(layerName, opacity, extend) {
        
        this.removeLayer()

        let sld = mapctl.getSld(layerName, this.legend),
          options = {
            serverUrl: config.mapUrl,
            visible: true,
            opacity: opacity ? opacity : '1',
            extent: extend,
            layerName: layerName,
            sld: sld,
            zIndex: 2
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
        this.removeCfLayer()
        this.layerName = layerName = `map:${layerName}`

        let options = {
          serverUrl: config.mapUrl,
          visible: true,
          extent: this.extent,
          layerName: layerName,
          sld: this.getCfSld(layerName, crops),
          zIndex: 3
        }

        this.classifyLayer = this.$refs['map'].addGeoLayer(options, this.map)
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
      }
    },
    watch: {
      cropId(id) {
        if (id !== '') {
          this.map.on("click", this.mapClickHandler);
        } else {
          this.map.un("click", this.mapClickHandler);
        }
      }
    },
    destroyed() {
      this.map.un("click", this.mapClickHandler);
    },
    components: {
      suitableLegend,
      productList,
      popupDetail

    }
  }
</script>

<style lang="less" scoped>

</style>