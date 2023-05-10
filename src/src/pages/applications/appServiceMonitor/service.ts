import { ApiResponse, PageResponse } from "@/services/public/service";
import { request } from "umi";


export async function getServiceByLabel(clusterId:number,namespace:string,labels:string) {
    let req=await request<ApiResponse<any>>('/v1/service/serviceByLabel',{
        method:'GET',
        params:{
            clusterId:clusterId,
            namespace:namespace,
            labels:labels
        },
    });
    return req;
}