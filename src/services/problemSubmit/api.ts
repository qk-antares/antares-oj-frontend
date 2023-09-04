import {request} from "@@/exports";

/** 提交 POST */
export async function doProblemSubmit(
    body: ProblemSubmit.ProblemSubmitAdd,
    options?: { [key: string]: any }
) {
  return request<API.R>('/oj/problem_submit', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 查看提交记录 POST */
export async function listProblemSubmitVoByPage(
  body: ProblemSubmit.ProblemSubmitQuery,
  options?: { [key: string]: any }
) {
  return request<API.R>('/oj/problem_submit/page/vo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取某次提交的详细信息 GET */
export async function getProblemSubmitVoById (
  id: number,
  options?: { [key: string]: any }
) {
  return request<API.R>(`/oj/problem_submit/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取摘要信息 GET */
export async function getSubmitSummary (
    options?: { [key: string]: any }
) {
  return request<API.R>(`/oj/problem_submit/summary`, {
    method: 'GET',
    ...(options || {}),
  });
}
