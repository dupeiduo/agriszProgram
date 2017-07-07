<template>
<div>
  <div class="page-expect-data expectdata-zIndex"
      v-show="showPageData" 
      :style="{left: left ? (screenWidth - menuWidth)/2 + 103 + 'px' : '',top: top ? (getScreenHeight - 48)/2 + 45 +'px' : ''}">
      <i class="iconfont icon-jingqingqidai-"></i>敬请期待
  </div>
  <div class="section-expect-data" v-show="showSectionData">
      <i class="iconfont icon-jingqingqidai-"></i>
      <span>敬请期待</span>
  </div>
</div>
</template>
<script>
import {mapGetters} from 'vuex'
  export default {
    props: {
      showPageData: {
        type: Boolean,
        default: false
      },
      showSectionData: {
        type: Boolean,
        default: false
      },
      left: {
        type: Boolean,
        default: true
      },
      top: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
      }
    },
    computed: {
     ...mapGetters({
      menuWidth: 'menuWidth',
      screenWidth: 'screenWidth',
      getScreenHeight: 'getScreenHeight'
    })},
    methods: {
    },
    mounted() {
    },
    components: {

    }
  }
</script>
<style 
lang="less" scoped>
@import '../../assets/style/common';
.page-expect-data {
  .adv-font-normal();
  .adv-common-border-radius(); 
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -53px;
  margin-top: -30px;
  width: 106px;
  height: 60px;
  line-height: 60px;
  padding: 0 40px 0 22px;
  background: rgba(0,0,0,.5);
  color: #fff;
  i {
    vertical-align: middle;
    margin-right: 20px;
   }
}
.section-expect-data {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  color: #496b01;
  i {
    font-size: 40px;
    display: block;
    color: #c1de84;
    text-align: center;
  }
  span {
    font-size: @font-super;
    color: #496b01;
  }
}
</style>