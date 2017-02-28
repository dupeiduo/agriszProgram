import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './config/routes'
import components from 'components/' //加载公共组件
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueScroll from 'vue-scroll'
import request from './api/request.js'
import {cookieUtil} from 'plugins/utils.js'

Vue.use(ElementUI)
Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase()) //首字母大写
  Vue.component(`v${name}`, components[key])
})

Vue.use(VueScroll)
Vue.use(VueRouter)
window.Vue = Vue;

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach(({meta,path}, from, next) => {
  request.isLogin().then( (data) => {
    let isLogin = data.data.is_login,
      userName = data.data.username

    if (isLogin) {
      store.commit('login', {isLogin, userName})
      next()
    } else {
      cookieUtil.setCookie('url_router_front', path, 'h2')
      store.commit('logout')
      next()
    }
  });
})

new Vue({
  el: '#app',
  router,
  store
})