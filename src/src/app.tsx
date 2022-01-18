import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig , RequestConfig } from 'umi';
import { history, Link , getIntl } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser , menuListByUserId } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import * as allIcons from '@ant-design/icons';
import type { MenuDataItem } from '@umijs/route-utils';
import React from 'react';
import { ResponseError } from 'umi-request';
import { notification } from 'antd';
import Aegis from 'aegis-web-sdk';
import { API_SERVER } from './apiserver';

console.log(process.env.UMI_ENV)
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const registerPath = '/user/register';

let initUserId:any = 0

const fixMenuItemIcon = (menus: MenuDataItem[], iconType = 'Outlined'): MenuDataItem[] => {
  menus.forEach((item) => {
    const { icon } = item;  //{ icon,children} in item
    if (typeof icon === 'string') {
      if(icon != '') {
        let fixIconName = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1) + iconType;
        item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon]);
      }
    }
    if (item.children && item.children.length > 0 ){
      item.children = fixMenuItemIcon(item.children)
    }
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
  getUserToken?:() => string;
  fetchUserInfo?: (userId?:number) => Promise<API.CurrentUser | undefined>;
}> {

  const setUserId = async (userId?:number) => {
    initUserId = userId
    sessionStorage.setItem("userId",initUserId)
  }

  const getUserToken = () => {
     var token = sessionStorage.getItem("loginStatus")
     if (token != null ) {
       return token
     } else {
       return ""
     }
  }
  
  const fetchUserInfo = async (userId?:number) => {
    try {
      console.log("get user info")
      const msg = await queryCurrentUser({ params:{ id: userId }});
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    if (initUserId == 0) {
      var id = sessionStorage.getItem("userId")
      if (id != null) {
        initUserId = Number(id)
      } else {
        history.push(loginPath)
      }
    }
    var currentUser 
    if(initUserId > 0) {
      currentUser = await fetchUserInfo(initUserId);
    }
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
      setUserId,
      getUserToken
    };
  }
  return {
    fetchUserInfo,
    settings: {},
    setUserId,
    getUserToken
  };
}

const defaultMenu = [
    {
            path: '/user/login',
            layout: false,
            name: 'login',
            component: './user/Login',
    },]

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    menu: {
      inlineSize: 120,
      locale:false,
      defaultOpenAll: true,
      params: {
          userId: initialState?.currentUser?.userid,
      },
      request: async (params, defaultMenuData) => {
        //console.log(params)
        //console.log(defaultMenuData)
        const userId = params?.userId
        if (userId == undefined || userId == "") {
          return []
        } else {
          let menuResponse = await menuListByUserId({ params:{ id: userId } })
          //console.log(menuResponse.data)
          let menuListJson : string = menuResponse.data
          let menuList = JSON.parse(menuListJson);
          console.log(menuList)
          return menuList
        }
        return []
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


const headerInterceptor = (url: string, options: RequestInit) => {
  if ( sessionStorage.getItem("loginStatus")) {
    const token = sessionStorage.getItem("loginStatus")
    options.headers = {
      ...options.headers,
      "Authorization" : 'Bearer ' + token
    }
  }
  return {url,options}
}

const errorHandler = (error:ResponseError) => {
  const { response,data } = error;
  if (response && response.status) {

    if (response.status == 401) {
      notification.error({
        message: '未授权的请求，请重新登录' , 
        description: '访问被拒绝'
      })
      sessionStorage.clear()
      history.push(loginPath)
    } else {
        // const errorText = response.statusText
        // const {status ,url } = response
        notification.error({
          message: `错误异常` , 
          description: data.message
        })
    }
  } else {
    var message = ""
    if(error.data.message != ""){
      const intl = getIntl()
      message = intl.formatMessage({id:error.data.message})
     
    } else {
      message = "操作失败"
    }
    notification.error({
      description:'提示',
      message: message
    })
    //console.log(error)
  }

}




export const request: RequestConfig = {
  prefix: isDev? '' : API_SERVER.api,
  credentials:'include',
  requestInterceptors: [ headerInterceptor ],
  errorHandler: errorHandler,
  // errorConfig:{
  //   adaptor:(resData) => {
  //     return {
  //       ...resData,
  //       success: true,
  //       errorMessage: resData.message
  //     }
  //   }
  // }
};

const aegis = new Aegis({
  id: '2eVr0fKbqpxy1PyZkx', // 上报 id
  uin: 'yoyofx', // 用户唯一 ID（可选）
  reportApiSpeed: true, // 接口测速
  reportAssetSpeed: true, // 静态资源测速
  spa: true // spa 应用页面跳转的时候开启 pv 计算
});