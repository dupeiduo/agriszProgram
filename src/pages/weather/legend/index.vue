<template>
  <div class="we-legend pr">
    <hr class="line ps" :style="{height: (24*legendData.length + 20) + 'px'}" v-if="!showLegend"/>
     <p class="we-legend-title clear">
        <em class="fl" :style="{display: showLegend ? 'none' : 'block'}">{{lengthTitle}}</em>
        <span class="iconfont fl"
        :class="showLegend ? 'icon-arrow-left-copy': 'icon-arrow-left-copy1'"
        @click="showLegend =! showLegend"
        ></span>
    </p>
     <ul class="legend-list  map-zIndex">
          <el-tooltip
            effect="dark" 
            v-for="(item, index) in legendData"
            :disabled="showLegend ? false : true"
            :content="item.name" placement="left">
            <li class="pr" :style="{height: showLegend ? (168/legendData.length) + 'px' : '24px'}">
              <span :style="{display: showLegend ? 'none' : 'block'}">{{item.name}}</span>
              <div class="length-bgcolor ps"><em :style="{background: item.color,height: showLegend ? (168/legendData.length) + 'px' : '24px'}"></em></div>
            </li>
          </el-tooltip>     
     </ul>
  </div>
</template>

<script>
import config from '../config/index.js'
  export default{
    props: {
      legendKey: {
        type: String,
        default: "atmos_tem"
      },
      lengthTitle: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        legendData: config.atmos_tem,
        showLegend: true
      }
    },
    mounted() {
    },
    computed: {

    },
    methods: {
    },
    watch: {
      legendKey(key) {
        this.legendData = config[key]
      }
    }
  }
</script>
<style scoped 
lang="less">
@import '../../../assets/style/common';
.we-legend {
    position: fixed;
    right: 12px;
    top: 210px;
    border-radius: 5px;
    background: @assistant-bg;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    .line {
      top: 18px;
      right: 32px;
      width: 1px;
      border: none;
      background: #d0d0d0;
    }
    .we-legend-title {
      line-height: 24px;
      height: 24px;
      border-bottom: 1px solid #d0d0d0;
      em {
        padding-left: 8px;
        min-width: 110px;
      }
      span {
        display: block;
        width: 32px;
        text-align: center;
        color: #a5a5a5;
        cursor: pointer;
      }
    }
    .legend-list {
      right: 0px;
      padding: 10px 0;
      li {
        span {
           position: absolute;
           top: 0;
           right: 36px;
           line-height: 24px;
        }
        .length-bgcolor {
          right: 0;
          width: 32px;
          em {
            width: 14px;
            margin: 0 9px;
            display: block;
          }
        }
      }
    }
}
</style>