import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  user:{
      login:false,
      userName:'',
      showLoginModal: false,
      errMsg: ''
  },
  map: {
    drawing: false
  },
  headerOpacity: 1,
  showBlur: false,
  screenHeight: document.documentElement.clientHeight || document.body.clientHeight,
  screenWidth: document.documentElement.clientWidth || document.body.clientWidth,
  menuWidth: 132,
  showLeftHeader: true,
  loading: false
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
