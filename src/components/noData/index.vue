<template>
  <div>
   <div class="no-date ps" v-if="noLayer">暂无数据</div>
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
.no-date {
    font-size: 14px;
    color: #fff;
    z-index: 100010;
    padding: 0 10px;
    top: 50%;
    left: 50%;
    height: 45px;
    line-height: 45px;
    transform: translate(-50%,-50%);
    background: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
  }
</style>