import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken,removeToken } from '@/utils/auth'
import Qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  transformRequest: [function(data) {
    data = Qs.stringify(data)
    return data
  }],
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
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

    // 全局错误信息提示
    if (res.Status !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.Status === 600 ) {
        // to re-login
        // MessageBox.confirm('已退出', '提示', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '隐藏',
        //   type: 'warning'
        // })
        Message({
          message:'登录超时',
          type:'success'
        })
        removeToken();
        location.reload();
        this.$router.push('login');
        // .then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })
        return false;
      }
      Message({
        message: res.Msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.Msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.Msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
