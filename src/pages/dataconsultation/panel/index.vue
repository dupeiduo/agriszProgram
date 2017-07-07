<template>
  <div class="panel-consultation" :style="{height: height + 'px'}">
    <!-- 高度与宽度根据外部确定或传人 -->
    <div class="panel-header-bg pr">
      <h3 class="panel-title">{{panelTitle}}</h3>
      <router-link class="ps panel-link" v-if="detailBtn" :to="detailBtn.href">{{detailBtn.name}}<i class="iconfont icon-icon-copy-copy"></i></router-link>
    </div>
    
    <slot name="panel-detail"></slot>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: {
    panelTitle: {
      type: String,
      default: ''
    },
    detailBtn: {
      type: Object,
      default: null
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      

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
    
  }, 
  watch: {

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
.panel-consultation {
  background: #fff;
  border: 1px solid #dcdcdc;
  .panel-header-bg {
    .panel-title {
      font-size: 14px;
      line-height: 42px;
      padding-left: 14px;
      background: #f4f7f7;
      border-bottom: 1px solid #dcdcdc;
    }
    .panel-link {
      right: 12px;
      top: 14px;
      color: #6ca201;
      cursor: pointer;
      text-decoration: underline;
      i {
        font-size: 12px;
      }
      &:hover {
        color: #85ad3e;
      }
    }
  }
}
</style>