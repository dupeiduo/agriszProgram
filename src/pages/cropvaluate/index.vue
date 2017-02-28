<template>
  <div>
    <img class="crop-valuate" src="/static/assets/img/temporary/crop-large.png" width="100%" srcset="/static/assets/img/temporary/crop-large.png 1920w, /static/assets/img/temporary/crop-middle.png 1280w, /static/assets/img/temporary/crop-small.png 800w" sizes="100vw"/>
    <p-footer></p-footer>
  </div>
</template>

<script>
  import pFooter from 'components/footer/';
  export default{
    data(){
      return {}
    },
    computed: {

    },
    methods: {
      initMap (map) {
        this.map = map;
      }
    },
    components: {
      pFooter
    }
  }
</script>
<style scoped>
  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .crop-valuate {
    margin-top: 100px;
  }
</style>