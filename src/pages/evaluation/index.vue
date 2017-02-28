<template>
  <div>
    <img class="evaluation" src="/static/assets/img/temporary/earth-large.png" width="100%" srcset="/static/assets/img/temporary/earth-large.png 1920w, /static/assets/img/temporary/earth-middle.png 1280w, /static/assets/img/temporary/earth-small.png 800w" sizes="100vw"/>
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
  .evaluation {
    margin-top: 100px;
  }
</style>