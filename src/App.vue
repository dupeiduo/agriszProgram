<template>
  <div id="app-entrance" v-loading.body="loading">
    <p-header></p-header>
    <div :class="showBlur ? 'bj-blur' : ''">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import pHeader from './components/newheader/';
import {mapState} from 'vuex'
import {mapGetters} from 'vuex'

export default {
  name: 'app-entrance',
  components: {
    pHeader,
  },
  computed: {
    ...mapState({
      showBlur: function (state) {
        return state.showBlur
      },
      loading: function (state) {
        return state.loading
      },
    })
  },
  mounted(){
    window.onresize = () => {
      var screenWidthRes = document.documentElement.clientWidth || document.body.clientWidth,
          screenHeightRes = document.documentElement.clientHeight || document.body.clientHeight
        this.$store.commit('getScreenWidth',screenWidthRes)
        this.$store.commit('getScreenHeight',screenHeightRes)
    }
  }
}
</script>

<style>
#app-entrance {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
