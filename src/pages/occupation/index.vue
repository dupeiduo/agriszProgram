<template>
  <div :style="{position: 'relative',width:screenWidth - menuWidth - 10 + 'px',left:menuWidth + 'px'}" :class="animationClassName">
    <img class="occupation" src="/static/assets/img/temporary/occupy-large.png" width="100%" />
    <p-footer></p-footer>
  </div>
</template>

<script>
  import pFooter from 'components/footer/';
  import {mapGetters} from 'vuex'
  export default{
    data(){
      return {
        animationClassName: ''
      }
    },
    computed: {
      ...mapGetters({
        menuWidth: 'menuWidth',
        getScreenHeight: 'getScreenHeight',
        screenWidth:'screenWidth'
    })},
    methods: {
      initMap (map) {
        this.map = map;
      }
    },
    watch: {
      menuWidth(width){
        if(width) {
          this.animationClassName = 'menu-left-animation'
        }
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
  .occupation {
    margin-top: 64px;
  }
</style>