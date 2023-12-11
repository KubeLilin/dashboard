import { ApiResponse, PageInfo, PageResponse } from "@/services/public/service";
import { request } from "umi";
import { TenatDeliverablesItem } from "./project_data";

export async function queryProject(pageParams: any): Promise<any> {
    let res = await request<PageResponse<TenatDeliverablesItem>>('/v1/deliverables/querytenantdeliverablesproject', {
        method: 'GET',
        params: pageParams
    })
    return new Promise(x => {
        x(res.data);
    })
}