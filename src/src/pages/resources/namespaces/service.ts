import request from "umi-request";
import { ApiResponse } from "@/services/public/service";


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
    let resData = await request<ApiResponse<K8sNamespcae[]>>("/v1/cluster/namespacesfromdb", {
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
