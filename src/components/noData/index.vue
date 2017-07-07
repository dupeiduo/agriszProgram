<template>
  <div>
   <div class="no-data ps expectdata-zIndex" v-if="noLayer">暂无数据</div>
  </div>
</template>
<script>
export default {
    props: {
      noLayer: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
      }
    },
    methods: {
    },
    mounted() {
    },
    components: {

    }
  }
</script>
<style 
lang="less" 
scoped>
@import '../../assets/style/common';
.no-data {
    .adv-font-normal();
    .adv-height(45px);
    .adv-common-border-radius();
    .adv-position-center();
    color: #fff;
    padding: 0 10px;
    background: rgba(0, 0, 0, 0.7);
  }
</style>