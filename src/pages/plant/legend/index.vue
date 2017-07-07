<template>
  <div class="legend">
    <span class="content-title good-content">好</span>
      <ul>
        <li v-for="item in legendList">
          <el-tooltip class="item" effect="dark" :content="item.name" placement="left">
            <span :style="{background: item.color}"></span>
          </el-tooltip>
        </li>
      </ul>
    <span class="content-title">差</span>
  </div>
</template>
<script>
import configData from '../../../config/data.js'

export default {
  data() {
    return {
      legendList: configData.plant.sutable
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style 
lang="less" scoped>
@import '../../../assets/style/common';
  .legend {
    position: fixed;
    z-index: 1;
    top: 210px;
    right: 12px;
    width: 32px;
    height: 214px;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    .adv-boxshadow();

    ul {
      margin: 5px 9px;

      li {
        span {
          width: 13px;
          height: 52px;
          display: block;
        }
      }
    }
    .good-content {
      margin-top: 8px;
    }
    .content-title {
      text-align: center;
      width: 30px;
      display: block;
    }
  }
</style>