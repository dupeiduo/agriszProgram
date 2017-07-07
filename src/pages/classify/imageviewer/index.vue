<template>
  <div class="img-map-container">
    <my-dialog class="photo-zoom dialog-bg"
      v-if="showImgZoomComponent"
      :width="'470'"
      :height="'347'"
      :padBottom="'0px'"
      :titleHeight="'auto'"
      :titlePadding="'20px 8px 18px 16px'"
      :useModal="false"
      @close="closeMe"
      >
      <h3 slot="title" class="photo-zoom-title no-select">拍摄于{{imgDate}}</h3>
      <div class="pr zoom-content" slot="content">
        <trans-img :photoSrc="imgUrl"></trans-img>
      </div>
    </my-dialog>
  </div>
</template>

<script>
  import transImg from '../../../components/transformImg'
  export default {
    props: {
      showImgZoomComponent: {
        type: Boolean,
        default: false
      },
      imgUrl: {
        type: String,
        default: '../../../../static/assets/img/classify/list1.png'
      },
      imgDate: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        width: 490,
        height: 289,
        map: null,
        layer: null,
        currentZoomLevel: 1,
        maxZoomLevel: 10,
        rotation: 0
      }
    },
    mounted() {
      // 给出屏幕变化时，宽和高
      
      this.width
      this.height

    },
    methods: {
      closeMe() {
        this.$emit('hideImageViewer')
      },
      addImageLayer(url) {
        if (!this.layer) {
          this.layer = this.getLayer(url)
          this.addImgMap(url, this.layer)

        } else {
          this.map.removeLayer(this.layer)

          this.layer = this.getLayer(url)
          this.map.addLayer(this.layer)
          this.setZoom(this.currentZoomLevel)
        }
        console.log(this.map.getView().getRotation())
      },
      getLayer(url) {
        var extent = [0, 0, this.width, this.height];
        var projection = new ol.proj.Projection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: extent
        });

        var layer = new ol.layer.Image({
          source: new ol.source.ImageStatic({
            url: url,
            projection: projection,
            imageExtent: extent
          })
        })

        return layer
      },
      addImgMap(url, layer) {
        var extent = [0, 0, this.width, this.height];
        var projection = new ol.proj.Projection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: extent
        });

        this.map = new ol.Map({
          layers: [ layer ],
          target: 'imgMap',
          view: new ol.View({
            projection: projection,
            center: ol.extent.getCenter(extent),
            zoom: this.currentZoomLevel,
            maxZoom: this.maxZoomLevel
          })
        });
      },
      setZoom(zoomLevel) {
        this.map.getView().setZoom(zoomLevel)
      },
    },
    watch: {
      showImgZoomComponent(show) {
        if (show && this.imgUrl !== '') {
          this.$nextTick(()=> {
            this.addImageLayer(this.imgUrl)
          })
        }
      },
      imgUrl(url) {
        if (this.showImgZoomComponent && this.imgUrl !== '') {
          this.$nextTick(()=> {
            this.addImageLayer(this.imgUrl)
          })
        }
      }
    },
    components:{
      transImg,
    }
  }
</script>

<style lang="less" scoped>
  
</style>