import { BACKEND_URL } from '@/config/config'
import { Message } from '@arco-design/web-vue'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { R } from './types'

if (import.meta.env.MODE != 'development') {
  axios.defaults.baseURL = `${BACKEND_URL}/api`
}
axios.defaults.withCredentials = true

// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse<R>) => {
    const res = response.data
    if (res.code != 200) {
      Message.error({
        content: res.msg || 'Error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return response
  },
  error => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

export default axios
