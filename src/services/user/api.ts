import {request} from "@@/exports";

/** 获取当前的用户 GET */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.R>('/member/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.R>('/member/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
