import { ApiResponse, PageResponse } from '@/services/public/service';

import { request } from 'umi';
import { ServiceConnectionItem } from './data';
export async function queryServiceConnections(params:any) {

    params.pageIndex=params.current;
    let req=await request<PageResponse<ServiceConnectionItem[]>>('/v1/serviceconnection/queryserviceconnections',{
        method:'GET',
        params:params
    })
    return req
}

export async function addGitRepo(data:any) {
    let reqData={
        name:data.name,
        serviceType:1,
        type:data.type,
        detail:JSON.stringify(data)
    }
    let req=await request<ApiResponse<any>>('/v1/serviceconnection/createserviceconnection',{
        method:'POST',
        data:reqData,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return req
}