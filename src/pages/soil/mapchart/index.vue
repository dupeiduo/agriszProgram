<template>
  <div v-if="options" 
    :id="barData.code" 
    class="map-chart-container">
    <my-echart :options="options" class="map-chart" 
      :style="{width: barData.size + 'px', height: barData.size + 'px'}"></my-echart>
  </div>
</template>

<script>
import echart from '../echart/index.js'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      options: null
    }
  },
  props: {
    barData: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      getScreenHeight: 'getScreenHeight'
    })
  },
  watch: {
    barData: {
      handler: function (data) {
        this.options = echart.getBarOption(data)
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.map-chart-container {
  position: absolute;
  top: -20px;
  left: -20px;
  .map-chart {
    width: 40px;
    height: 40px;
  }
}
</style>