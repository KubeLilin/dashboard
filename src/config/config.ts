// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/test',
      layout: false,
    },
    {
      path: '/dashboard',
      icon: 'dashboard',
      routes: [
        {
          name: 'analysis',
          icon: 'smile',
          path: '/dashboard/analysis',
          component: './dashboard/analysis',
        },
        {
          name: 'monitor',
          path: '/dashboard/monitor',
          component: './dashboard/monitor',
        }
      ]
    },
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
      ],
    },
    {
      path: '/exception',
      layout: false,
      routes: [
        {
          path: '/exception',
          redirect: '/exception/403',
        },
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      name: 'resources',
      path: '/resources',
      routes: [
        {
          name: "clusters",
          path: "/resources/clusters",
          component:"./resources/clusters/clusters"
        },
        {
          name: "namespaces",
          path:"/resources/namespaces",
          component:"./resources/namespaces"
        },
        {
          name: "nodes",
          path: "/resources/nodes",
          component:"./resources/nodes"
        },
        {
          name: "pods",
          path: "/resources/pods",
          component:"./resources/pods"
        }
      ]
    },
    {
      name:'applications',
      path:'/applications',
      routes:[
        {
          name: "apps",
          path: "/applications/apps",
          component:"./applications/apps/apps"
        },
        {
          name: "info",
          path: "/applications/info",
          component:"./applications/info"
        },
        {
          name: "deployments",
          path: "/applications/info/deployments",
          component:"./applications/info/deployments"
        },
      ]
    },
    {
      name:'devops',
      path:'/devops',
      routes:[
        {
          name: "pipeline",
          path: "/devops/pipeline",
          component:"./devops/pipeline"
        },
      ]
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        {
          "component": "./account/manage",
          "name": "manage",
          "path": "/account/manage"
        },
        {
          "component": "./account/route",
          "name": "route",
          "path": "/account/route"
        },
        {
          "component": "./account/role",
          "name": "role",
          "path": "/account/role"
        },
        {
          "component": "./account/tenant",
          "name": "tenant",
          "path": "/account/tenant"
        }
      ],
    },
    {
      path: '/',
      redirect: '/dashboard/analysis',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  define: {
    'process.env.UMI_ENV':process.env.UMI_ENV || 'dev',
  },
});
