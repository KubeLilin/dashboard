import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig , RequestConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser , menuListByUserId } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import * as allIcons from '@ant-design/icons';
import type { MenuDataItem } from '@umijs/route-utils';
import React from 'react';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const registerPath = '/user/register';

let initUserId:any = 0

const fixMenuItemIcon = (menus: MenuDataItem[], iconType = 'Outlined'): MenuDataItem[] => {
  menus.forEach((item) => {
    const { icon, children } = item;
    if (typeof icon === 'string') {
      let fixIconName = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1) + iconType;
      item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon]);
    }
    children && children.length > 0 ? (item.children = fixMenuItemIcon(children)) : null;
  });
  return menus;
};


/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading  />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  setUserId?:(userId?: number) => void;
  fetchUserInfo?: (userId?:number) => Promise<API.CurrentUser | undefined>;
}> {

  const setUserId = async (userId?:number) => {
    initUserId = userId
  }

  const fetchUserInfo = async (userId?:number) => {
    try {
      const msg = await queryCurrentUser({ params:{ id: userId }});
      return msg.data;
    } catch (error) {
      //history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo(initUserId);
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
      setUserId
    };
  }
  return {
    fetchUserInfo,
    settings: {},
    setUserId
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    menu: {
      params: {
          userId: initialState?.currentUser?.userid,
      },
      request: async (params, defaultMenuData) => {
        //console.log(params)
        //console.log(defaultMenuData)
        const userId = params?.userId
        if (userId == undefined || userId == "") {
          return defaultMenuData
        } else {
          let menuResponse = await menuListByUserId({ params:{ id: userId } })
          //console.log(menuResponse.data)
          let menuListJson : string = menuResponse.data
          let menuList: MenuDataItem[] = JSON.parse(menuListJson);
          return menuList
        }
        return defaultMenuData
      }
    },  
    menuDataRender: (menuData) => {
        return fixMenuItemIcon(menuData)
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (location.pathname == registerPath) {
        history.push(registerPath);
        return 
      }
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};


export const request: RequestConfig = {
  //prefix:'http://localhost:8080/',
  credentials:'include',
  errorHandler: (error) => {
    // 集中处理错误
    console.log(error);
  }
};
