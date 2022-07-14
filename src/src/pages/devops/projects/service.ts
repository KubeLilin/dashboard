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

export async function getProjectList(params: any) {
    let req = await request<PageResponse<DevopsProjectItem[]>>("/v1/devops/projectlist", {
        method: 'GET',
        params: params
    })

    return new Promise<PageResponse<DevopsProjectItem[]>>(x=>x(req))

}