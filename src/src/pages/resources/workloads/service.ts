
import { ApiResponse } from "@/services/public/service";
import {request} from "umi";

export async function getNameSpaceList(clusterId:number) :Promise<any[]>{
    let resData = await request<ApiResponse<any[]>>("/v1/cluster/namespaces", {
        method: 'GET',
        params:{'cid':clusterId}
    })
    console.log(resData)
    let data =  resData.data.map(x=>{return  {value:x.name,label:x.name}})
    return new Promise(x=>x(data))
}

export async function getWorkloads(clusterId:number,namespace:string,workload:string) {
    let resData = await request<ApiResponse<any[]>>("/v1/cluster/workloads", {
        method: 'GET',
        params:{cid:clusterId,namespace:namespace,workload:workload}
    })
    return resData
}