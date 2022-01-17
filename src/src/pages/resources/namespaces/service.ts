import {request} from "umi";
import { ApiResponse } from "@/services/public/service";
import { TenantTableListItem } from "./data"

export type ClusterItem = {
    id: number,
    teanantId: number,
    name: string,
    version: string,
    distrbution: string,
    sort?: number,
    status: number
}

export type K8sNamespcae={
    name:string,
    status:string,
}

export async function GetClusterList() :Promise<{ value: number; label: string; }[]>{
    let resData = await request<ApiResponse<ClusterItem[]>>("/v1/cluster/list", {
        method: 'GET',
    })
    let data=  resData.data.map(x=>{return  {value:x.id,label:x.name}})
    return new Promise(x=>x(data))
}

export async function GetNameSpaceList(clusterId:number) :Promise<ApiResponse<K8sNamespcae[]>>{
    let resData = await request<ApiResponse<K8sNamespcae[]>>("/v1/cluster/namespaces", {
        method: 'GET',
        params:{'cid':clusterId}
    })
    return resData
    //let data=  resData.data.map(x=>{return  {value:x.name,label:x.name}})
    //return new Promise(x=>x(data))
}

export async function PutNewNameSpace(clusterId:number,namespace:string) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/newnamespace", {
        method: 'PUT',
        params:{'cid':clusterId ,'namespace': namespace }
    })
    return resData
}

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
    console.log(params)
    params.tName = params.keyword
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
