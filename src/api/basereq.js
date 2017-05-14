import axios from 'axios'
import store from '../store'
import {cookieUtil} from 'plugins/utils.js'


export default {
  php: {
    post: function(url, data, header) {
      var CancelToken = axios.CancelToken,
        source = CancelToken.source(),
        axiosXhr = axios.post(url,
          data,
          { headers:header, cancelToken: source.token }
        )
        .catch(phpReqError)

      axiosXhr.cancelRequest = source.cancel 

      return axiosXhr
    },
    get: function(url, header) {
      var CancelToken = axios.CancelToken,
        source = CancelToken.source(),
        axiosXhr = axios.get(url,
          { headers:header, cancelToken: source.token }
        )
        .catch(phpReqError)

      axiosXhr.cancelRequest = source.cancel 

      return axiosXhr
    }
  },
  api: {
    post: function(url, data, header) {
      var CancelToken = axios.CancelToken,
        source = CancelToken.source(),
        axiosXhr = axios.post(
          url,
          data,
          { headers:header, cancelToken: source.token }
        )
        .catch(requestError)

      axiosXhr.cancelRequest = source.cancel

      return axiosXhr
    },
    get: function(url, header) {
      var CancelToken = axios.CancelToken,
        source = CancelToken.source(),
        axiosXhr = axios.get(
          url, 
          { headers:header, cancelToken: source.token }
        )
        .catch(requestError)

      axiosXhr.cancelRequest = source.cancel
      return axiosXhr
    }
  }
}

function requestError(response) {
  if (typeof response.message === "string" && response.response.status !== 403) {
    console.log(response.message)
    
  } else if (response.response.status === 403) {
    // is login
    store.dispatch('isLogin')
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