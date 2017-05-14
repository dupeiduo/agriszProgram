import axios from 'axios'
import config from 'config/env/config.env.js'
import request from 'api/request.js'
import {cookieUtil} from '../plugins/utils.js'


export const login = ({ commit }, userInfo) => {
  userLoginRequest(userInfo, commit)
}

export const logout = ({commit}) => {
  userLogOutRequest(commit)
}

export const isLogin = ({commit}) => {
  isLoginRequest(commit)
}


var userLoginRequest = function(userInfo, commit) {
  var params = new FormData();
  params.append('account', userInfo.name);
  params.append('password', userInfo.pwd);

  request.login(params).then(function (response) {
    if (response.status === 200 && response.data.status === 200) {
      cookieUtil.setCookie('token', response.data.token, "d1")
      var userName = response.data.username;
      var isLogin = true
      commit('login',{isLogin, userName})
    } else {
      var err = response.data.msg
      if (response.data.status === 400) {
        commit('loginerr', "密码错误")
        
      } else if (response.data.status === 500) {
        commit('loginerr', "账号错误")
      }
      
    }
  })
};

var userLogOutRequest = function(commit) {
  request.logout().then(function (response) {
    if (response.status === 200) {
      commit('logout')
    }
  })
};

var isLoginRequest = function (commit) {
  request.isLogin().then( (data) => {
    let isLogin = data.data.is_login

    if (isLogin) {
      request.getToken().then((data) => {
        if (data) {
          cookieUtil.setCookie('token', data.data.token, "h2")
          window.location.reload();
        } else {
          commit('logout')
          commit('showLogin', true)
        }
      })
    } else {
      commit('logout')
      commit('showLogin', true)
    }
  })
}