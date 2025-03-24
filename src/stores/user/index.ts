import { getCurrentUser, login, loginByCode, logout } from '@/api/user'
import type { AccountLoginReq, CodeLoginReq, UserVo } from '@/api/user/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref<UserVo | null>(null)

  const refreshStore = async () => {
    const res = await getCurrentUser()
    console.log(res.data.data)

    isLoggedIn.value = res.data.data != null
    userInfo.value = res.data.data || null
  }

  const loginStore = async (data: AccountLoginReq) => {
    const res = await login(data)
    isLoggedIn.value = res.data.code === 200
    userInfo.value = res.data.data || null
  }

  const loginByCodeStore = async (data: CodeLoginReq) => {
    const res = await loginByCode(data)
    isLoggedIn.value = res.data.code === 200
    userInfo.value = res.data.data || null
  }

  const logoutStore = async () => {
    await logout()
    isLoggedIn.value = false
    userInfo.value = null
  }

  return {
    isLoggedIn,
    userInfo,
    refresh: refreshStore,
    login: loginStore,
    loginByCode: loginByCodeStore,
    logout: logoutStore,
  }
})

export default useUserStore
