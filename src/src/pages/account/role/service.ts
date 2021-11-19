import { request } from 'umi';
import { TableListItem,MenuListItem, CreateOrUpdateRoleMenuRequest } from './data';
import { ApiResponse } from '../../../services/public/service'

/*
** roleQuery 角色列表查询
*/
export async function roleQuery(
    params: {
      /** 当前的页码 */
      tenantId?:number;
      pageIndex?: number;
      current?: number;
      /** 页面的容量 */
      pageSize?: number;
    }, options?: { [key: string]: any } ) {
    params.pageIndex = params.current
    params.current = undefined
    var requestData =  await request<{
        data: {
            data: TableListItem[];
            total?: number;
        }; 
        message?: string;
        success?: boolean; }>('/v1/tenantrole/tenantrolelist', {
            method: 'GET',
            params: {
                ...params,
            },
            ...(options || {}),
        });
    let retData :{
            data:  TableListItem[];
            /** 列表的内容总数 */
            total?: number;
            success?: boolean;
        } = { 
            data: requestData.data.data,
            success : requestData.success,
            total : requestData.data.total
        }
    
        //return query(params,options)
        return new Promise<any>(resolve => {
            resolve(retData)
        })
  }

/**
 * 菜单查询(all)
 * @param params 
 * @param sort 
 * @param options 
 * @returns 
 */
export const queryMenuList = async (
    params: {
      tenantId?: number;
      pageIndex?: number;
      current?: number;
      pageSize?: number;
    },
    sort: Record<string, any>,
    options?: { [key: string]: any },) => {

    const msg = await request<ApiResponse<MenuListItem[]>>('/v1/sysmenu/usermenutree',  { method: 'GET', });
    return {
        data: msg.data,
        success: msg.success,
        total: 0
    }
}


/**
 * 获取角色对象的菜单路由ID列表 , [1,2,3] by menu_id 
 * @param roleId 
 * @returns 
 */
export const getMenuListByRoleId = async (roleId:number) => {
    return request<ApiResponse<number[]>>('/v1/sysmenu/rolemenulist',{
        params:{ roleId: roleId } , method:'GET' ,
    })

}

/**
 * 提交分配角色菜单
 * @param requestData [ {角色ID,菜单ID} ,....]
 * @returns 
 */
export const postRoleMenuMap = async (requestData:CreateOrUpdateRoleMenuRequest) => {
    return request<ApiResponse<any>>('/v1/RoleMenu/RoleMenuMap',{
        data: requestData,
        method:'POST' ,   
        headers: {
            'Content-Type': 'application/json',
        },
    })
}


/**
 * 删除角色(禁用)
 * @param roleId 角色ID
 * @returns 成功
 */
export const deleteRole = async (roleId:number) => {
    return request<ApiResponse<string>>('/v1/TenantRole/TenantRole',{
        params:{ id: roleId } , method:'DELETE' ,
    })

}

export const createRole = async (role:TableListItem) => {
    return request<ApiResponse<string>>('/v1/TenantRole/TenantRole',{
        data:role  , method:'POST' ,
        headers: {
            'Content-Type': 'application/json',
        },
    })

}


export const updateRole = async (role:TableListItem) => {
    return request<ApiResponse<string>>('/v1/TenantRole/UpdateTenantRole',{
        data:role , method:'POST' ,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}