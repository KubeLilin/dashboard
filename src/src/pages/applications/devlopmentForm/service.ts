import { ClusterItem ,K8sNamespcae} from "@/pages/resources/clusters/cluster_data";
import { ApiResponse } from "@/services/public/service";
import { Label } from "bizcharts";
import request from "umi-request";
import { DeploymentStep1 } from "./devlopment_data";
export async function BindNamespace() {
    
}

export async function BindCluster() :Promise<any>{
    let resData = await request<ApiResponse<ClusterItem[]>>("/v1/cluster/list", {
        method: 'GET',
    })
    let data=  resData.data.map(x=>{return  {value:x.id,label:x.name}})
    return new Promise(x=>x(data))
}

export async function BindNameSpace(clusterId:number) :Promise<ApiResponse<K8sNamespcae[]>>{
    let resData = await request<ApiResponse<K8sNamespcae[]>>("/v1/cluster/namespaces", {
        method: 'GET',
        params:{'cid':clusterId}
    })
    return resData
    //let data=  resData.data.map(x=>{return  {value:x.name,label:x.name}})
    //return new Promise(x=>x(data))
}

export async function CreateDeploymnet(params:DeploymentStep1) {
    let req=await request<ApiResponse<DeploymentStep1>>("/v1/cluster/createdeploymentstep1",{
        method:'POST',
        data:params
    })
    return req
}
