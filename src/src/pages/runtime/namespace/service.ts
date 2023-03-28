import {request} from "umi";
import { ApiResponse } from "@/services/public/service";
import { TenantTableListItem,NamespaceInfo,NewQuota } from "./data"

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
    let data=  resData.data?.map(x=>{return  {value:x.id,label:x.name}})
    return new Promise(x=>x(data))
}

export async function GetNameSpaceList(clusterId:number,tentantName:string,pageIndex:number,pageSize:number) :Promise<{ data:NamespaceInfo[],success:boolean,total:number } >{
    let resData = await request<any>("/v1/cluster/namespacesByTenantId", {
        method: 'GET',
        timeout: 1500,
        params:{'cid':clusterId , 'current': pageIndex, 'pageSize':pageSize }
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
//IsInstalledDapr

export async function IsInstalledDaprRuntime( clusterId:number) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/IsInstalledDapr", {
        method: 'GET',
        timeout:100,
        params:{'cid':clusterId }
    })
    return resData
}


export async function PutUpateRuntime( namespaceId:number , enableRuntime:boolean,runtimeName:string) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/updateruntime", {
        method: 'PUT',
        params:{'namespaceId':namespaceId ,'enableRuntime': enableRuntime, 'runtimeName': runtimeName}
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

export async function GetResourceQuota(clusterId:number,namespace:string ) :Promise<ApiResponse<any>>{
    let resData = await request<ApiResponse<any>>("/v1/cluster/resourcequota", {
        method: 'GET',
        timeout:500,
        params:{'cid':clusterId ,'namespace': namespace}
    })
    return resData
}

