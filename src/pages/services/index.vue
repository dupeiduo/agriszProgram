<template>
  <div>
    <img class="service" src="/static/assets/img/temporary/service-large.png" width="100%" srcset="/static/assets/img/temporary/service-large.png 1920w, /static/assets/img/temporary/service-middle.png 1280w, /static/assets/img/temporary/service-small.png 800w" sizes="100vw"/>
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
  .service {
    margin-top: 100px;
  }
</style>