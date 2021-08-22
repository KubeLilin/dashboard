/**
 * 路由配置项
 */
export interface IRouteConfig {
    name: string;
    id: string;
    path: string;
    component?: any;
    exact?: boolean;
    redirect?: string;
    children?: IRouteConfig[];
  }