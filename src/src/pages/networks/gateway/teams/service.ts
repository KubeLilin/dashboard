import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';

export async function getTeamList(params: any) {
    let req= await request<ApiResponse<any>>('/v1/apigateway/teamlist',{
        method:'GET',
        params: params
    })
   return req
}

export async function createOrEditTeam(formData: any){
    let resData = await request<ApiResponse<boolean>>("/v1/apigateway/createoreditteam", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        data:formData
    })
    return resData
}