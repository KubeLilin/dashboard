import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';

export async function getAppLanguages() :Promise<any> {
    let req= await request<ApiResponse<any>>('/v1/application/applanguage',{
        method:'GET',
    })
   return new Promise(x=>x(   req.data.map((v:any)=>({label:v.alias, value:v.id }) )))
}

export async function getBuildImageByLanguages(params: any) {
    let req= await request<ApiResponse<any>>('/v1/application/buildimagebylanguages',{
        method:'GET',
        params: params
    })
   return req
}

export async function addEditBuildImage(params:any) {
    let req= await request<ApiResponse<any>>('/v1/application/buildimage',{
        method:'POST',
        data:params
    })
   return req
}

export async function deleteBuildImage(id:number) {
    let req= await request<ApiResponse<any>>('/v1/application/deletebuildimage',{
        method:'DELETE',
        params: {
            id: id
        }
    })
   return req
}

