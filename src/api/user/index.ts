import axios from 'axios'
import type { R } from '../common/types'
import type { AccountLoginReq, AKSKVo, CodeLoginReq, UserVo } from './types'

export function login(data: AccountLoginReq) {
  return axios.post('/user/login', data)
}

export function loginByCode(data: CodeLoginReq) {
  return axios.post('/user/loginByCode', data)
}

export function sendMailCode(email: string) {
  return axios.get('/user/email/sendCode', {
    params: {
      email,
    },
  })
}

export function getCurrentUser() {
  return axios.get<R<UserVo>>('/user/current')
}

export function getAKSK() {
  return axios.get<R<AKSKVo>>('/user/aksk')
}

export function logout() {
  return axios.post('/user/logout')
}
