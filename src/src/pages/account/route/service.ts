
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
