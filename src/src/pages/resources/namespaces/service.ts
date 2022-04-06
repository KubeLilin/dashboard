import {request} from "umi";
import { ApiResponse } from "@/services/public/service";
import { TenantTableListItem,NamespcaeInfo,NewQuota } from "./data"

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

export async function GetNameSpaceList(clusterId:number,tentantName:string,pageIndex:number,pageSize:number) :Promise<{ data:NamespcaeInfo[],success:boolean,total:number } >{
    let resData = await request<any>("/v1/cluster/namespacelist", {
        method: 'GET',
        timeout: 1500,
        params:{'cid':clusterId , 'tenant': tentantName , 'current': pageIndex, 'pageSize':pageSize }
    })
    if(!resData){ 
        return { 
            data: [],
            success : false,
            total : 0,
        }
    }

    return { 
        data: resData.data.data,
        success : resData.success,
        total : resData.data.total,
    }
}

export async function PutNewK8sNameSpace(clusterId:number,namespace:string ) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/newk8snamespace", {
        method: 'PUT',
        params:{'cid':clusterId ,'namespace': namespace}
    })
    return resData
}


export async function PutNewNameSpace(clusterId:number,namespace:string , tentantId:number) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/newnamespace", {
        method: 'PUT',
        params:{'cid':clusterId ,'namespace': namespace, 'tentantId': tentantId}
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


export async function GetResourceQuota(clusterId:number,namespace:string ) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/resourcequota", {
        method: 'GET',
        params:{'cid':clusterId ,'namespace': namespace}
    })
    return resData
}



export async function PostResourceQuota(postData:NewQuota ) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/resourcequota", {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        //params:{clusterId:clusterId,tenantId: tenantId},
        data: postData

    })
    return resData
}