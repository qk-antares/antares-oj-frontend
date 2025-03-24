export interface R<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface Page<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface PageReq {
  current?: number
  size?: number
  sortField?: string
  sortOrder?: string
}
