import { request } from 'umi'
import { ApiResponse } from '@/services/public/service'

export interface ServiceMonitorProps {
    clusterId:number,
    namespace:string,
    serviceName:string,
    startTime:any,
    endTime:any,
    refresh:number,
}

export async function getCustomMetrics(params:any)  {
    let resData = await request<ApiResponse<any>>("/v1/metrics/customMetrics", {
        method: 'GET',
        params: params
    })
    return resData
}

export async function getPodCPUUsage(params:any)  {
    let resData = await request<ApiResponse<any>>("/v1/metrics/podCPUUsage", {
        method: 'GET',
        params: params
    })
    return resData
}

export async function getPodMemoryUsage(params:any)  {
    let resData = await request<ApiResponse<any>>("/v1/metrics/podMemoryUsage", {
        method: 'GET',
        params: params
    })
    return resData
}

// PodMemoryRss
export async function getPodMemoryRss(params:any)  {
    let resData = await request<ApiResponse<any>>("/v1/metrics/podMemoryRss", {
        method: 'GET',
        params: params
    })
    return resData
}

// GetPodMemorySwap
export async function getPodMemorySwap(params:any)  {
    let resData = await request<ApiResponse<any>>("/v1/metrics/podMemorySwap", {
        method: 'GET',
        params: params
    })
    return resData
}

//GetPodNetworkReceiveBytes
export async function getPodNetworkReceiveBytes(params:any)  {
    let resData = await request<ApiResponse<any>>("/v1/metrics/podNetworkReceiveBytes", {
        method: 'GET',
        params: params
    })
    return resData
}

//GetPodNetworkTransmitBytes
export async function getPodNetworkTransmitBytes(params:any)  {
    let resData = await request<ApiResponse<any>>("/v1/metrics/podNetworkTransmitBytes", {
        method: 'GET',
        params: params
    })
    return resData
}
