import { ApiResponse, PageResponse } from "@/services/public/service";
import { endsWith } from "lodash";
import { request } from "umi";
import { ProbeFormData } from "./probe_data";

export async function saveProbe(params: ProbeFormData) {
    let req = await request<ApiResponse<any>>('/v1/deployment/probe', {
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return req;
}

export async function getProBe(dpId: any) {
    let req = await request<ApiResponse<ProbeFormData>>('/v1/deployment/probe', {
        method: 'GET',
        params: {
            dpId: dpId
        }
    })
    return req;
}