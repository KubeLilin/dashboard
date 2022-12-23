import { ApiResponse, PageResponse } from "@/services/public/service";
import { request } from "umi";

export async function getConfigmapListByAppId(appid:number) {
    let req= await request<ApiResponse<any>>('/v1/configmap/listbyappid',{
        method:'GET',
        params: {
            appId:appid
        }
    })
   return req
}