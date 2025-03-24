export interface AccountLoginReq {
  email: string
  password: string
}

export interface CodeLoginReq {
  email: string
  captcha: string
}

export interface UserVo {
  uid?: number
  username?: string
  email?: string
  tags?: string[]
  signature?: string
  sex?: number
  avatar?: string
  userRole?: '' | 'user' | 'admin' | 'ban'
}
