import { ApiResponse, PageResponse } from "@/services/public/service";
import { request } from "umi";
import { ProbeFormData } from "./probe_data";

export async function saveProbe(params: ProbeFormData) {
    let req = await request<ApiResponse<string>>('/v1/deployment/probe', {
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return req;
}