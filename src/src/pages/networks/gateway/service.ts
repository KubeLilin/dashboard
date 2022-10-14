import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';


export async function getAllGateway(params: any) {
    let req= await request<ApiResponse<any>>('/v1/apigateway/list',{
        method:'GET',
        params: params
    })
   return req
}


export async function getClusterList() :Promise<any>{
    let resData = await request<ApiResponse<any[]>>("/v1/cluster/list", {
        method: 'GET',
    })
    let data=  resData.data?.map(x=>{return  {value:x.id,label:x.name}})
    return new Promise(x=>x(data))
}