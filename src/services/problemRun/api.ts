import {request} from "@@/exports";

/** 提交 POST */
export async function doProblemRun(
    body: ProblemRun.ProblemRunRequest,
    options?: { [key: string]: any }
) {
  return request<API.R>('/oj/problem_run', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
