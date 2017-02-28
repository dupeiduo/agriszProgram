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
    cookieUtil.delCookie('ci_session')
    state.user = {
      login: false,
      userName: '',
      errMsg: '',
      showLoginModal: false
    }
  },
  showLogin(state, isShow) {
    state.user.showLoginModal = isShow
  }
}