import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';

export async function getRouterByName(params: any) {
    let req= await request<ApiResponse<any>>('/v1/apigateway/routerbyname',{
        method:'GET',
        params: params
    })
   return req
}

export async function createOrEditRoute(formData: any){
    let resData = await request<ApiResponse<boolean>>("/v1/apigateway/createoreditrouter", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        data:formData
    })
    return resData
}