<template>
  <div id="app-entrance">
    <p-header></p-header>
    <div :class="showLoginModal ? 'bj-blur' : ''">
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
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
      showLoginModal: function (state) {
        return state.user.showLoginModal
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
