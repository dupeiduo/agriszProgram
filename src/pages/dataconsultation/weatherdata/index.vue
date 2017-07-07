<template>
  <div class="weather-data">
  <div class="chart-menu pr">
    <ul>
      <li v-for="(item,index) in diffList" @click="clickMenu(index)" :class="current === index ? 'active' : ''"> 
        <i class="iconfont" :class="item.icon" :style="{color: current === index ? item.color : ''}"></i>
        {{item.name}}
      </li>
    </ul>
    <slot name="echart"></slot>
  </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import configData from '../config/index.js'
export default {
  props: {
    weOptions: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      diffList: configData.weatherMenu,
      current: 0,
    }
  },
  mounted() {
  },
  computed: {
    ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
  })},
  methods: {
    clickMenu(index){
      this.current = index
    },
  }, 
  watch: {
    current: function(index){
      this.$emit('chageChart',this.diffList[index])
    }
  },
  componets: {
    
  }
}
</script>
<style 
  lang="less"
   rel="stylesheet/less"
   scoped>
@import '../../../assets/style/common';
.weather-data {
  .chart-menu {
    ul {
      overflow: hidden;
      height: 40px;
      padding-left: 18px;
      border-bottom: 1px solid #dcdcdc;
      li {
        float: left;
        box-sizing: border-box;
        font-size: 14px;
        color: #a4a4a4;
        cursor: pointer;
        position: relative;
        border-bottom: 4px solid #fff;
        width: 80px;
        padding-left: 14px;
        height: 40px;
        line-height: 40px;
        &:hover {
          color: #333;
        }
        .tool-pop-arrow {
          left: 33px;
          bottom: 0;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 5px solid #97cb6f;
          display: none;
        }
      }
      .active {
        color: #333;
        border-bottom: 4px solid #97cb6f;
      }
    }
  }
}
</style>