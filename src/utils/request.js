import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import fa from 'element-ui/src/locale/lang/fa'

// 是否显示重新登录
export let isRelogin = { show: false }

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }

    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code) {
      if (res.code == 200) {
        return res
      } else if (res.code == 401) {
        // to re-login
        if (location.hash === '#/login' || location.hash === '#/') {
          store.dispatch('user/resetToken').then(() => {
            router.push('/login')
          })
        } else {
          if (!isRelogin.show) {
            isRelogin.show = true
            MessageBox.confirm('当前登录信息已过期或失效,请重新登录', '提示', {
              confirmButtonText: '重新登录',
              showCancelButton: false,
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                router.push('/login')
              })
            }).catch(() => {
              isRelogin.show = false
            })
          }
          return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        }
      } else if (res.code == 500) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        return res
      }
      // if (res.code != 200) {
      //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      //   if (res.code == 401) {
      //     // to re-login
      //     if (location.hash === '#/login' || location.hash === '#/') {
      //       store.dispatch('user/resetToken').then(() => {
      //         router.push('/login')
      //       })
      //     } else {
      //       MessageBox.confirm('当前登录信息已过期或失效,请重新登录', '提示', {
      //         confirmButtonText: '重新登录',
      //         showCancelButton: false,
      //         closeOnClickModal: false,
      //         type: 'warning'
      //       }).then(() => {
      //         store.dispatch('user/resetToken').then(() => {
      //           router.push('/login')
      //         })
      //       })
      //     }
      //   } else {
      //     Message({
      //       message: res.msg || 'Error',
      //       type: 'error',
      //       duration: 5 * 1000
      //     })
      //   }
      //   return res
      // } else {
      //   return res
      // }
    } else {
      return res
    }
  },
  response => {
    // for debug
    console.log('err' + response) // for debug
    Message({
      message: response,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(response)
  }
)

/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof (value) !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof (value[key]) !== 'undefined') {
            const params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

export default service
