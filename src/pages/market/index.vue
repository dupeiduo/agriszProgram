<template>
  <div>
    <market-content></market-content>
    <p-footer></p-footer>
  </div>
</template>

<script>
  import request from 'api/request.js'
  import format from 'api/model.js'
  import marketContent  from 'pages/market/menuBtn/'
  import pFooter from 'components/footer/'
  export default{
    data(){
      return {
      }
    },
    computed: {

    },
    methods: {
    },
    components: {
      marketContent,
      pFooter
    }
  }
</script>
<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
</style>