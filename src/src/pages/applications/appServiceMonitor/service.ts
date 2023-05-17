import { ApiResponse, PageResponse } from "@/services/public/service";
import { request } from "umi";

import { ServiceMonitorRequestData } from "./data";

export async function getServiceByLabel(clusterId:number,namespace:string,labels:string) {
    let req=await request<ApiResponse<any>>('/v1/service/serviceByLabel',{
        method:'GET',
        params:{
            clusterId:clusterId,
            namespace:namespace,
            label:labels
        },
    });
    return req;
}

// create or update service monitor
export async function createOrUpdateServiceMonitor(fromData: ServiceMonitorRequestData) {
    return request<ApiResponse<any>>('/v1/service/createOrUpdateServiceMonitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: fromData,
    });
}

// get service monitor list
export async function getServiceMonitorList(appId:number) {
    return request<ApiResponse<any>>('/v1/service/serviceMonitorList', {
        method: 'GET',
        params: {
            appId:appId
        },
    });
}

// delete service monitor
export async function deleteServiceMonitor(id:number) {
    return request<ApiResponse<any>>('/v1/service/serviceMonitor', {
        method: 'DELETE',
        params: {
            id:id
        },
    })
}