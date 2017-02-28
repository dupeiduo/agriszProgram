import axios from 'axios'
import request from './request.js'
import store from '../store'
import {cookieUtil} from 'plugins/utils.js'


export default {
  php: {
    post: function(url, data, header) {
      return axios.post(url,
        data,
        {headers:header}
      )
      .catch(phpReqError)
    },
    get: function(url, header) {
      return axios.get(url,
        {headers:header}
      )
      .catch(phpReqError)
    }
  },
  api: {
    post: function(url, data, header) {
      return axios.post(url,
        data,
        {headers:header}
      )
      .catch(requestError)
    },
    get: function(url, header) {
      return axios.get(url,
        {headers:header}
      )
      .catch(requestError)
    }
  }
}

function requestError(response) {
  if (response.response.status === 403) {
    // is login
    request.isLogin().then( (data) => {
      let isLogin = data.data.is_login
      if (isLogin) {
        request.getToken().then((data) => {
          if (data) {
            cookieUtil.setCookie('token', data.data.token, "h2")
            window.location.reload();
          } else {
            store.commit('logout')
            store.commit('showLogin', true)
          }
        })
      } else {
        store.commit('logout')
        store.commit('showLogin', true)
      }
    })
      
  }
  console.log(response.message);
}

function phpReqError(response) {
  if (response.response.status === 403) {
    store.commit('logout')
    store.commit('showLogin', true)
  }
  console.log(response.message);
}