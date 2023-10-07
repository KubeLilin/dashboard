
import { ApiResponse } from "@/services/public/service";
import {request} from "umi";

export async function getNameSpaceList(clusterId:number) :Promise<any[]>{
    let resData = await request<ApiResponse<any[]>>("/v1/cluster/namespaces", {
        method: 'GET',
        params:{'cid':clusterId}
    })
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

export async function ApplyYaml(clusterId:number,yaml:string) {
    let resData = await request<ApiResponse<any>>("/v1/dynamic/apply", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data:{clusterId:clusterId,yaml:yaml}
    })
    return resData
    
}