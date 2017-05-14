const userName = state => state.user.userName
const isLogin = state => state.user.login
const showLoginModal = state => state.user.showLoginModal
const showBlur = state => state.showBlur
const errMsg = state => state.user.errMsg
const drawing = state => state.map.drawing
const headerOpacity = state => state.headerOpacity

export {
  userName,
  isLogin,
  showLoginModal,
  errMsg,
  drawing,
  headerOpacity,
  showBlur
}
