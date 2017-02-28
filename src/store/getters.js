const userName = state => state.user.userName
const isLogin = state => state.user.login
const showLoginModal = state => state.user.showLoginModal
const errMsg = state => state.user.errMsg

export {
  userName,
  isLogin,
  showLoginModal,
  errMsg
}
