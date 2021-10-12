import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { TenantTableListItem } from './tenant_data';

export async function queryTenant(
    params: {
        pageIndex?: number;
        pageSize?: number;
        current?: number;
    },
    options?: {
        [key: string]: any
    }
) {

    params.pageIndex = params.current;
    params.current = undefined;
    return request<{
        data: {
            data: TenantTableListItem[];
            total?: number;
        };
        message?: string;
        success?: boolean
    }>(
        '/v1/tenant/tenantlist', {
        method: 'GET',
        params: {
            ...params
        },
        ...(options || {}), 
    }
    )
}

export async function addTenant(params:TenantTableListItem) {
   let res=   await request<ApiResponse<TenantTableListItem>>("/v1/tenant/create",{
        method:'POST',
        data:params,
        headers:{
            'Content-Type': 'application/json',
          },
    })
    console.log(res)
    return res.success
}