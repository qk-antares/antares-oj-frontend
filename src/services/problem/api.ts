import {request} from "@@/exports";

/** 创建题目（管理员） POST */
export async function createProblem(
    body: Problem.ProblemAdd,
    options?: { [key: string]: any }
) {
  return request<API.R>('/oj/problem', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 更新题目（管理员） PUT */
export async function updateProblem(
    body: Problem.ProblemUpdate,
    options?: { [key: string]: any }
) {
  return request<API.R>('/oj/problem', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 获取题目详情（管理员） GET */
export async function getProblemVoById(
    id: number,
    options?: { [key: string]: any }
) {
  return request<API.R>(`/oj/problem/${id}/vo`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 删除题目（管理员） DELETE */
export async function deleteProblem(
    id: number,
    options?: { [key: string]: any }
) {
  return request<API.R>(`/oj/problem/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 分页获取题目（管理员） POST */
export async function listProblemVoByPage(
    body: Problem.ProblemQuery,
    options?: { [key: string]: any }
) {
  return request<API.R>('/oj/problem/page/vo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取所有标签 GET */
export async function getProblemTags(
  options?: { [key: string]: any }
) {
  return request<API.R>(`/oj/problem/tags`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取题目（普通用户） POST */
export async function listSafeProblemVoByPage(
    body: Problem.ProblemQuery,
    options?: { [key: string]: any }
) {
  return request<API.R>('/oj/problem/page/vo/safe', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取题目详情（用户） GET */
export async function getSafeProblemById(
  id: number,
  options?: { [key: string]: any }
) {
  return request<API.R>(`/oj/problem/${id}/vo/safe`, {
    method: 'GET',
    ...(options || {}),
  });
}




