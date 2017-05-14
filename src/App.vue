<template>
  <div id="app-entrance">
    <p-header></p-header>
    <div :class="showBlur ? 'bj-blur' : ''">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import pHeader from './components/header/';
import {mapState} from 'vuex'

export default {
  name: 'app-entrance',
  components: {
    pHeader,
  },
  computed: {
    ...mapState({
      showBlur: function (state) {
        return state.showBlur
      }
    })
  }
}
</script>

<style>
#app-entrance {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
