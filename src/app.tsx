import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {requestConfig} from './requestConfig';
import React from 'react';
import {getCurrentUser} from "@/services/user/api";
import {AvatarDropdown, AvatarName} from "@/components/AvatarDropdown";
import {message} from "antd";

const loginPath = 'http://blog.antares.cool/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: User.UserInfo;
  loading?: boolean;
  fetchUserInfo?: () => Promise<User.UserInfo | undefined>;
}> {
  //获取用户信息，这是一个异步请求(只是一个方法，不会真正执行)
  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUser();
      return res.data;
    } catch (error) {
      message.error('未登录！');
      history.push(`${loginPath}?redirect=http://oj.antares.cool${history.location.pathname}`);
    }
    return undefined;
  };

  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    onPageChange: () => {
      if (!initialState?.currentUser) {
        message.error('未登录！');
        history.push(`${loginPath}?redirect=http://oj.antares.cool${history.location.pathname}`);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>无权限</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      return (
        <>
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request = {
  ...requestConfig,
};
