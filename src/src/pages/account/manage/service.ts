// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';
import { ApiResponse } from "@/services/public/service";


/** 获取规则列表 GET /api/rule */
export async function query(
  params: {
    // query
    /** 当前的页码 */
    tenantId?: number;
    pageIndex?: number;
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  params.pageIndex = params.current
  params.current = undefined
  return request<{
    data: {
      data: TableListItem[];
      total?: number;
    }; 
    /** 列表的内容总数 */
    message?: string;
    success?: boolean;
  }>('/v1/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateUser(data?: TableListItem, options?: { [key: string]: any }) {
  return request<TableListItem>('/v1/user/update', {
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    ...(options || {}),
  });
}

export async function setUserStatus(options?: { [key: string]: any }) {
  return request<{
    success? :boolean
    message? :string
  }>('/v1/user/status', {
    method: 'PUT',
    ...(options || {}),
  });
}


/** 新建用户 POST /v1/user/register */
export async function addUser(data: TableListItem, options?: { [key: string]: any }) {
  return request<{
    data?:any
    success? :boolean
    message? :string
  }>('/v1/user/register', {
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}



export async function GetQueryUserRole(userId?:number) :Promise<{ value: number; label: string; }[]>{
  let resData = await request<any>("/v1/tenantuserrole/userrole", {
      method: 'GET',
      params: {
        userId:userId,
        pageIndex:1,
        pageSize:10
      }
  })
  let data=  resData.data.data.map(x=>{return  {value:x.roleId,label:x.roleName}})
  return new Promise(x=>x(data))
}

export async function GetAllRoleList() :Promise<{ value: number; label: string; }[]>{
  let resData = await request<ApiResponse<any[]>>("/v1/tenantuserrole/allrole", {
      method: 'GET',
  })
  let data=  resData.data.map(x=>{return  {value:x.roleId,label:x.roleName}})
  return new Promise(x=>x(data))
}

export async function PostUserRoles(data:any) {
  return request<ApiResponse<any>>('/v1/tenantuserrole/userrole', {
    data: data,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST'
  });
}
