import { ApiResponse, PageInfo, PageResponse } from "@/services/public/service";
import { request } from "umi";
import { TenatDeliverablesItem } from "./project_data";

export async function queryProject(pageParams: any): Promise<any> {
    let res = await request<PageResponse<TenatDeliverablesItem>>('/v1/deliverables/tenantdeliverablesproject', {
        method: 'GET',
        params: pageParams
    })
    return new Promise(x => {
        x(res.data);
    })
}


export async function createProject(params: any): Promise<ApiResponse<TenatDeliverablesItem>> {
    return request<ApiResponse<TenatDeliverablesItem>>('/v1/deliverables/tenantdeliverablesproject', {
        method: 'POST',
        data:params       ,
         headers:{
            'Content-Type': 'application/json',
          },
    })
}