import axios from 'axios'
import type { Page, R } from '../common/types'
import type {
  ExecuteCodeReq,
  ExecuteCodeRes,
  ProblemAddReq,
  ProblemQueryReq,
  ProblemSubmitAddReq,
  ProblemSubmitQueryReq,
  ProblemSubmitVo,
  ProblemUpdateReq,
  ProblemVo,
  SafeProblemVo,
} from './types'

export function addProblem(data: ProblemAddReq) {
  return axios.post<R<number>>('/judge/problem', data)
}

export function listProblemVoByPage(data: ProblemQueryReq) {
  return axios.post<R<Page<ProblemVo>>>('/judge/problem/page/vo', data)
}

export function updateProblem(data: ProblemUpdateReq) {
  return axios.put<R>('/judge/problem', data)
}

export function getProblemVoById(id: number) {
  return axios.get<R<ProblemVo>>(`/judge/problem/${id}/vo`)
}

export function deleteProblem(id: number) {
  return axios.delete<R>(`/judge/problem/${id}`)
}

export function getProblemTags() {
  return axios.get<R<string[]>>('/judge/problem/tags')
}

export function getSafeProblemVoById(id: number) {
  return axios.get<R<SafeProblemVo>>(`/judge/problem/${id}/vo/safe`)
}

export function listSafeProblemVoByPage(data: ProblemQueryReq) {
  return axios.post<R<Page<SafeProblemVo>>>('/judge/problem/page/vo/safe', data)
}

export function doProblemRun(data: ExecuteCodeReq) {
  return axios.post<R<ExecuteCodeRes>>('/judge/run', data)
}

export function doProblemSubmit(data: ProblemSubmitAddReq) {
  return axios.post<R<ProblemSubmitVo>>('/judge/submit', data)
}

export function listProblemSubmitVoByPage(data: ProblemSubmitQueryReq) {
  return axios.post<R<Page<ProblemSubmitVo>>>('/judge/submit/page/vo', data)
}
