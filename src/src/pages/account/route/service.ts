
import { request } from 'umi';
import { MenuListItem } from './data';
import { ApiResponse } from '../../../services/public/service'

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


export const postCreateOrUpdateMenu = ( data:MenuListItem) => {
    return request<ApiResponse<boolean>>('/v1/sysmenu/CreateOrUpdateMenu', { 
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json',
        },
    });
}


export const deleteMenu = ( id: number ) => {
    return request<ApiResponse<boolean>>('/v1/sysmenu/menu',{
        method:'DELETE',
        params:{ id: id },
    })
}