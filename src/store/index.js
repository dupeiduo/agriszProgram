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
  showBlur: false
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
