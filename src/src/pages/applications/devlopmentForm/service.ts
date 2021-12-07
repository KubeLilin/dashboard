import { ClusterItem ,K8sNamespcae} from "@/pages/resources/clusters/cluster_data";
import { ApiResponse } from "@/services/public/service";
import { method } from "@umijs/deps/compiled/lodash";
import { Label } from "bizcharts";
import request from "umi-request";
import { DeploymentStep } from "./devlopment_data";
export async function BindNamespace() {
    
}

export async function BindCluster() :Promise<any>{
    let resData = await request<ApiResponse<ClusterItem[]>>("/v1/cluster/list", {
        method: 'GET',
    })
    let data=  resData.data.map(x=>{return  {value:x.id,label:x.name}})
    return new Promise(x=>x(data))
}

export async function BindNameSpace(clusterId:number) :Promise<ApiResponse<any[]>>{
    let resData = await request<ApiResponse<any[]>>("/v1/cluster/namespacesfromdb", {
        method: 'GET',
        params:{'cid':clusterId}
    })
    return resData
    //let data=  resData.data.map(x=>{return  {value:x.name,label:x.name}})
    //return new Promise(x=>x(data))
}

export async function CreateDeploymnet(params:DeploymentStep) {
    console.log(params.servicePort)
let req=await request<ApiResponse<DeploymentStep>>("/v1/deployment/createdeploymentstep1",{
        method:'POST',
        data:params,
        headers:{
            'Content-Type': 'application/json',
          },
    })
    return req
}

export async function CreateDeploymnetLimit(params:DeploymentStep) {
    let req=await request<ApiResponse<DeploymentStep>>("/v1/deployment/createdeploymentstep2",{
        method:'POST',
        data:params,
        headers:{
            'Content-Type': 'application/json',
          },
    })
    return req
}

export async function GetDeploymentFormInfo(id?:number) {
    let req=await request<ApiResponse<DeploymentStep>>(`/v1/deployment/deploymentforminfo?dpId=${id}`,{
        method:'GET',
    })
    return req
}
