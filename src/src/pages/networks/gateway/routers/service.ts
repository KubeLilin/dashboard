import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';


export async function getRouterList(params: any) {
    let req= await request<ApiResponse<any>>('/v1/apigateway/routerlist',{
        method:'GET',
        params: params
    })
   return req
}

export async function getAppList(params: any) {
    let req= await request<ApiResponse<any>>('/v1/apigateway/applist',{
        method:'GET',
        params: params
    })
   return req.data
}

export async function getDeploymentList(params: any) {
    let req= await request<ApiResponse<any>>('/v1/apigateway/deploymentlist',{
        method:'GET',
        params: params
    })
   return req.data
}



