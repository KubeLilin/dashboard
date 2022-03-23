import { ApiResponse,PageResponse ,PageInfo } from '@/services/public/service';
import { request } from 'umi';
import { DeploymentItem ,PodItem,PipelineInfo } from './data';

export async function getDeploymentList(
    params: {
        pageIndex?: number;
        current?: number;
        pageSize?: number;
        appid?: number;
        name?: string;
    }, ):Promise<PageInfo<DeploymentItem[]>> {

        let resData=await request< PageResponse<DeploymentItem[]>>("/v1/deployment/list",{
            method:'GET',
            params:params
        })
        
    return new Promise(x=>x( resData.data ))
    
}

export async function executeDeployment(dpId:any) {
    let req=await request<ApiResponse<any>>("/v1/deployment/executedeployment",{
        method:'POST',
        params:{dpId:dpId}
    })
    return req
}


export const getPodList = async (appName:string , clusterId:number , index :number)=> {
        let resData=await request< ApiResponse<PodItem[]>>("/v1/cluster/pods",{
            method:'GET',
            params:{ app: appName , cid: clusterId }
        })
        console.log(resData)
        if (resData.data == null){
            return { index:index, data: null }
        }  
        return { index:index, data: resData.data }
    }

export async function GetApplicationInfo(appid:number) {
    let resData = await request<ApiResponse<any>>("/v1/application/info",{
        method:'GET',
        params:{ appid: appid }
    })
    return resData
}


export async function GetAppGitBranches(appid:number) {
    let resData = await request<ApiResponse< {git:string,branches:string[]}  >>("/v1/application/gitbranches",{
        method:'GET',
        params:{ appid: appid }
    })
    return resData
}


export async function GetBuildScripts() {
    let resData = await request<ApiResponse<any>>("/v1/application/buildscripts",{
        method:'GET',
    })
    return resData
}

export async function NewPipeline(appid:number , name:string) {
    let resData = await request<ApiResponse<number>>("/v1/application/newpipeline",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
          },
        data: {
            appid: appid,
            name: name,
        }
    })
    return resData
}

export async function GetPipelineList(appid:number) {
    let resData = await request<ApiResponse<PipelineInfo[]>>("/v1/application/pipelines",{
        method:'GET',
        params:{ appid: appid }
    })
    return resData
} 


export async function SavePipeline(formdata:any) {
    let resData = await request<ApiResponse<boolean>>("/v1/application/editpipeline",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
          },
        data: formdata
    })
    return resData
}

export async function GetPipelineById(id:number) {
    let resData = await request<ApiResponse<PipelineInfo>>("/v1/application/pipeline",{
        method:'GET',
        params:{ id: id }
    })
    return resData
} 


export async function RunPipeline(pipelineId:number, appId:number) {
    let resData = await request<ApiResponse<number>>("/v1/application/runpipeline",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
          },
        data: {
            id: pipelineId,
            appid: appId
        }
    })
    return resData
}

export async function GetPipelineDetails(appId:number,pipelineId:number,taskId:number) {
    let resData = await request<ApiResponse<any>>("/v1/application/pipelinedetails",{
        method:'GET',
        params: {
            id: pipelineId,
            appId:appId,
            taskId:taskId
        }
    })
    return resData
}


export async function GetPipelineLogs(appId:number,pipelineId:number,taskId:number) {
    let resData = await request<ApiResponse<string>>("/v1/application/pipelinelogs",{
        method:'GET',
        params: {
            id: pipelineId,
            appId:appId,
            taskId:taskId
        }
    })
    return resData
}

export async function GetNotifications() {
    let resData = await request<ApiResponse<{label:string,value:string}[]>>("/v1/deployment/notifications",{
        method:'GET'
    })
    return resData
}