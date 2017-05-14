import {set} from 'vue'
import {cookieUtil} from 'plugins/utils.js'

export default {
  login(state, { isLogin, userName }) {
    state.user.login = isLogin
    state.user.userName = userName
    state.user.errMsg = ''
    state.user.showLoginModal = false
  },
  loginerr(state, msg) {
    state.user.showLoginModal = true
    state.user.errMsg = msg
  },
  logout(state) {
    cookieUtil.delCookie('token')
    cookieUtil.delCookie('sess_name_rscloud_formal_data_agrisz_com')
    window.memoryCache = null
    state.user = {
      login: false,
      userName: '',
      errMsg: '',
      showLoginModal: false
    }
  },
  showLogin(state, isShow) {
    state.user.showLoginModal = isShow
  },
  startDraw(state) {
    state.map.drawing = true
  },
  stopDraw(state) {
    state.map.drawing = false
  },
  changeHeaderOpacity(state, opacity) {
    state.headerOpacity = opacity
  },
  showBlurModal(state, show) {
    state.showBlur = show
  }
}