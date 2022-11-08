import { ApiResponse,PageResponse } from '@/services/public/service';
import { request } from 'umi';
import { createProjectItem,DevopsProjectItem } from './data'


export async function createProject(items:createProjectItem) {
    let resData = await request<ApiResponse<string>>("/v1/devops/createproject", {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json'},
        data:items
    })
    return resData
}

export async function EditProject(items:createProjectItem) {
    let resData = await request<ApiResponse<string>>("/v1/devops/editproject", {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json'},
        data:items
    })
    return resData
}

export async function deleteProject(projectId:number) {
    let resData = await request<ApiResponse<string>>("/v1/devops/project", {
        method: 'DELETE',
        params:{
            id: projectId
        }
    })
    return resData
}

export async function getProjectList(params: any) {
    let req = await request<PageResponse<DevopsProjectItem[]>>("/v1/devops/projectlist", {
        method: 'GET',
        params: params
    })
    return new Promise<PageResponse<DevopsProjectItem[]>>(x=>x(req))
}

export async function getApps(params:{
    pageSize?: number;
    current?: number;
    pageIndex?:number;
  },sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>): Promise<any> {
      params.pageIndex=params.current
    let req= await request<ApiResponse<any>>('/v1/devops/applist',{
        method:'GET',
        params:params
    })
   return new Promise(x=>x({data:req.data.data,success:req.success,total:req.data.total}))
}


export async function GetPipelineList(projectId:number) {
    let resData = await request<ApiResponse<[]>>("/v1/devops/pipelinelist",{
        method:'GET',
        params:{ projectId: projectId }
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


export async function GetResourceMetrics(projectId:number) {
    let resData = await request<ApiResponse<any>>("/v1/devops/resourcemetrics",{
        method:'GET',
        params:{ projectId: projectId }
    })
    return resData
} 