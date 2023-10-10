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


export async function DeleteDeployment(dpId:number) {
    let req = await request<ApiResponse<string>>("/v1/deployment/deployment",{
        method:'DELETE',
        params:{dpId:dpId}
    })
    return req
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
            timeout:1500,
            skipErrorHandler: true,
            params:{ app: appName , cid: clusterId }
        })
        if (resData ){
            return { index:index, data: resData.data }
        }  
        return { index:index, data: null }
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
    let resData = await request<ApiResponse<number>>("/v1/application/runPipeline",{
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

export async function RunPipelineWithBranch(pipelineId:number, appId:number,branch:string) {
    let resData = await request<ApiResponse<number>>("/v1/application/runPipelineWithBranch",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
          },
        data: {
            id: pipelineId,
            appid: appId,
            branch:branch
        }
    })
    return resData
}


export async function AbortPipeline(pipelineId:number, appId:number,taskId:number) {
    let resData = await request<ApiResponse<number>>("/v1/application/abortpipeline",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
          },
        data: {
            id: pipelineId,
            appid: appId,
            taskId: taskId
        }
    })
    return resData
}

export async function DeletePipeline(pipelineId:number) {
    let resData = await request<ApiResponse<any>>("/v1/application/pipeline",{
        method:'DELETE',
        params:{ id: pipelineId } 
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

export async function GetDeployLevelCounts(appId:number) {
    let resData = await request<ApiResponse<{label:string,value:string,count:number}[]>>("/v1/application/deploylevelcounts",{
        method:'GET',
        params: {
            appid:appId
        }
    })
    return resData
}

export async function GetProjectDeployLevelCounts(projectId:number) {
    let resData = await request<ApiResponse<{label:string,value:string,count:number}[]>>("/v1/application/projectdeploylevelcounts",{
        method:'GET',
        params: {
            projectId:projectId
        }
    })
    return resData
}

export async function getRouterList(params: any) {
    let req= await request<ApiResponse<any>>('/v1/apigateway/routerlistBy',{
        method:'GET',
        params: params
    })
   return req
}

export async function GetDeploymentFormInfo(id?:number) {
    let req=await request<ApiResponse<any>>(`/v1/deployment/deploymentById?dpId=${id}`,{
        method:'GET',
    })
    return req
}


export async function GetTestFormInfo(id?:number) {
    let req=await request<ApiResponse<any>>(`/v1/deployment/test?dpId=${id}`,{
        method:'GET',
    })
    return req
}
