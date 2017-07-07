<template>
  <div>
    <!-- 新加入的div作物 颜色 -->
    <div class="filter-crop-color-choose">
      <div class="filter-crop-color-contain" v-for="(item,index) in lagendColor">
        <span  :style="{background: item.lendBg}"></span>
        <span>&nbsp;{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import configData from '../../../config/data.js'
  export default {
    data() {
      return {
        lagendColor: configData.agrimgrColor.crop
      }
    },
    mounted() {
       
    },
    methods: {
      
    },
    watch: {
      
    },
    components: {
      
    }
  }
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/common';
.mixin-filter-public-color-div(){
    width: 14px;
    height: 14px;
    border-radius: 2px;
    background: red;
    display: table-cell;
    vertical-align: middle;
  }
.filter-crop-color-choose{
    background: white;
    position: fixed;
    right: 12px;
    top: 210px;
    padding: 2px 8px 8px;
    .adv-common-border-radius();
    .filter-crop-color-contain{
      margin-top: 8px;
      line-height: 14px;
      span{
        display: table-cell;
        vertical-align: middle;
        &:first-child {
          .mixin-filter-public-color-div;
        }
      }
    }
  }

</style>