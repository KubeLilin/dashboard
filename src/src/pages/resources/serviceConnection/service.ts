import { ApiResponse, PageResponse } from '@/services/public/service';
import { isNil } from 'lodash';

import { request } from 'umi';
import { RepoServiceConnection, ServiceConnectionItem } from './data';
export async function queryServiceConnections(params: any) {

    params.pageIndex = params.current;
    let req = await request<PageResponse<ServiceConnectionItem[]>>('/v1/serviceconnection/queryserviceconnections', {
        method: 'GET',
        params: params
    })
    return req
}

export async function addGitRepo(data: any,serviceType:number) {
    let reqData = {
        name: data.name,
        serviceType: serviceType,
        type: data.type,
        detail: JSON.stringify(data)
    }
    let req = await request<ApiResponse<any>>('/v1/serviceconnection/createserviceconnection', {
        method: 'POST',
        data: reqData,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return req
}

export async function editGitRepo(data: any, id: number,serviceType:number) {
    let reqData = {
        id: id,
        name: data.name,
        serviceType: serviceType,
        type: data.type,
        detail: JSON.stringify(data)
    }
    console.log(reqData)
    let req = await request<ApiResponse<any>>('/v1/serviceconnection/updateserviceconnection', {
        method: 'POST',
        data: reqData,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return req
}

export async function getServiceConnectionInfo(id: number) {
    let req = await request<ApiResponse<ServiceConnectionItem>>('/v1/serviceconnection/serviceconnectioninfo', {
        method: 'GET',
        params: {
            id
        }
    })
    return req;
}



export async function queryRepoConnections(repoType: string) {
    let req = await request<ApiResponse<ServiceConnectionItem[]>>('/v1/serviceconnection/repolistbytype', {
        method: 'GET',
        params: {
            serviceType:1,
            repoType: repoType
        }
    })
    let noneOption = [{ label:"无", value:''}]

    if (req.success){
        if (req.data){
            let retData = req.data.map(x=>{let detail= JSON.parse(x.detail);return {label:x.name,value:detail.repo}})
            return retData
        }
        return noneOption
      
    }
    return noneOption
}