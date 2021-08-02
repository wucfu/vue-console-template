import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '../router'
import { transformParams, transform } from './'
import { refreshToken } from '@/api/system/user'
import { readBlob } from './index'

let isRefreshing = false
let retryRequests = []

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 10000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'If-Modified-Since': 'Thu, 01 Jun 1970 00:00:00 GMT', // 避免 IE10 返回 304
    'shouldIntercept': true // 若为 false,则不拦截在自己的请求里处理
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    console.log('request interceptors url:' + config.url)
    if (store.getters.token) {
      config.headers['authorization'] = 'Bearer ' + store.getters.token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  async response => {
    let res = response.data

    // 增加对文件判断
    if (res instanceof Blob) {
      if (res.size < 1000) {
        // 如果读取文件的时候成功，返回的size不会太大，所以大于1000就无需校验，直接返回成功
        try {
          res = await readBlob(res)
        } catch (err) {
          // 读取到突破，无需理会，直接放行
        }
      }
    }

    if (res instanceof Object) {
      if (res.code !== 'success') {
        if (res.code) {
          if (res.code === 2) {
            Message.error(res.data || res.message)
            throw new Error(res)
          } else {
            Message.error(res.message || 'Error')
            throw new Error(res)
          }
        }
      }
    }

    return res
  },
  async error => {
    if (error && error.response && error.response.request.response) {
      const response = error.response
      const config = response.config
      let data = response.data
      switch (response.status) {
        case 401:

          // 增加对文件判断
          if (data instanceof Blob) {
            data = await readBlob(data)
          }

          switch (data.code) {
            case '40100':
              // 无token信息，需要登录
              Message.warning('请重新登录')
              router.push({ path: '/login' })
              return
            case '40111':
              // token信息过期
              if (!isRefreshing) {
                isRefreshing = true
                return refreshToken(store.getters.refreshToken).then(res => {
                  const { data: { accessToken, refreshToken }} = res
                  store.dispatch('user/refreshToken', { accessToken, refreshToken })
                  config.baseURL = ''
                  retryRequests.forEach(cb => cb())
                  retryRequests = []
                  return service(config)
                }).catch(() => {
                  // token刷新失败之后清空所有保存的请求
                  retryRequests = []
                  router.push({ path: '/login' })
                }).finally(() => {
                  isRefreshing = false
                })
              } else {
                // 正在刷新token，将返回一个未执行resolve的promise
                return new Promise((resolve) => {
                  // 将resolve放入队列，用一个函数来保存，等token沙墟完成后直接执行
                  retryRequests.push(() => {
                    config.baseURL = ''
                    resolve(service(config))
                  })
                })
              }
            case '40113':
              // refresh token超时，需要重新登录
              Message.warning('上次登录超时，需要重新登录')
              store.dispatch('user/logout').then(() => {
                router.push({ path: '/login' })
              })
              return
            default:break
          }
          break
        case 403:
          router.push({ path: '/401' })
          break
        case 404:
          router.push({ path: '/404' })
          break
        default:break
      }
      if (data.status && data.status === 500) {
        Message.error('系统异常，请联系管理员')
      } else {
        Message.error(data.msg || data.message || '无可用信息')
      }
      return Promise.reject(data)
    } else {
      console.log('请求异常：' + error.message)
      if (error.code === 'ECONNABORTED') {
        Message.error('请求响应超时')
      } else {
        Message.error(error.message || '请求失败')
      }
      return Promise.reject(error.message)
    }
  }
)

export default {

  get(resource, data, config = {}) {
    // 处理参数为null的情况
    transformParams(data)
    const { url, params } = transform(resource, data)
    return service.get(url, { params, ...config })
  },

  post(resource, data, body, config = {}) {
    const { url } = transform(resource, data)
    return service.post(url, body, config)
  },

  del(resource, data) {
    const { url, params } = transform(resource, data)
    return service.delete(url, params)
  },

  put(resource, data, body) {
    const { url } = transform(resource, data)
    return service.put(url, body)
  }
}
