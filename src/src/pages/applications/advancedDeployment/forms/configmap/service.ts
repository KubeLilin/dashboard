import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';


export async function applyConfigmap(formData: any){
    let resData = await request<ApiResponse<boolean>>("/v1/configmap/apply", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        data:formData
    })
    return resData
}

export async function getConfigmap(params: any) {
    let req= await request<ApiResponse<any>>('/v1/configmap/configmap',{
        method:'GET',
        params: params
    })
   return req
}


export async function getList(params: any) {
    let req= await request<ApiResponse<any>>('/v1/configmap/list',{
        method:'GET',
        params: params
    })
   return req
}

export async function clearConfigmap(params: any) {
    let req= await request<ApiResponse<any>>('/v1/configmap/configmap',{
        method:'DELETE',
        params: params
    })
   return req
}