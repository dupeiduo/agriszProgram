const userName = state => state.user.userName
const isLogin = state => state.user.login
const showLoginModal = state => state.user.showLoginModal
const showBlur = state => state.showBlur
const errMsg = state => state.user.errMsg
const drawing = state => state.map.drawing
const headerOpacity = state => state.headerOpacity
const getScreenHeight = state => state.screenHeight
const screenWidth = state => state.screenWidth
const menuWidth = state => state.menuWidth
const showLeftHeader = state => state.showLeftHeader
const loading = state => state.loading

export {
  userName,
  isLogin,
  showLoginModal,
  errMsg,
  drawing,
  headerOpacity,
  showBlur,
  getScreenHeight,
  screenWidth,
  menuWidth,
  showLeftHeader,
  loading
}
