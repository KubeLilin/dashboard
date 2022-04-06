import { ApiResponse, PageResponse } from '@/services/public/service';

import { request } from 'umi';
import { ServiceConnectionItem } from './data';
export async function queryServiceConnections(params:any) {

    let req=await request<PageResponse<ServiceConnectionItem[]>>('/v1/serviceconnection/queryserviceconnections',{
        method:'GET',
        params:params
    })
    return req
}