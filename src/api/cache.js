import baseReq from './basereq.js'
import {cookieUtil} from '../plugins/utils.js'
import confUrl from 'config/env/config.env.js'

export default {
  get: {
    php: function(url) {
      return baseReq.php.get(confUrl.phpUrl + url, 
          {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        )
    },
    api: function(url) {
      let token = cookieUtil.getCookie('token')
      return baseReq.api.get(confUrl.apiUrl + url, 
          {
            'content-type': 'application/json',
            'tokenId': token
          }
        )
    },
    tdt: function(url) {
      return baseReq.api.get(url)
    },
    phpInCache: function(url) {
      return getCacheData(confUrl.phpUrl + url, 'application/x-www-form-urlencoded; charset=UTF-8')
    },
    apiInCache: function(url) {
      let token = cookieUtil.getCookie('token')
      return getCacheData(confUrl.apiUrl + url, 'application/json', token)
    },
  },
  post: {
    php: function(url, postData) {
      return baseReq.php.post(confUrl.phpUrl + url, postData, 
        {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    },
    api: function(url, postData) {
      var token = cookieUtil.getCookie('token')
      return baseReq.api.post(confUrl.apiUrl + url, postData, 
        {
          'content-type': 'application/json',
          'tokenId': token
        })
    }
  }
}

function getCacheData(url, contentType, token) {
  window.memoryCache = window.memoryCache ? window.memoryCache : {}

  let promise = null,
    cacheData = window.memoryCache[url]

  if (cacheData) {
    promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(cacheData)
      })
    })
  } else {
    let header = {}

    header['content-type'] = contentType
    if (token) {
      header['tokenId'] = token
    }

    promise = window.memoryCache[url] = baseReq.api.get(url, header)
  }
  return promise
}
