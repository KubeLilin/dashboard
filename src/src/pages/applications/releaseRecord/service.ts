import { ApiResponse, PageResponse } from "@/services/public/service";
import { request } from "umi";
import { DeploymentStep } from "../devlopmentForm/devlopment_data";
import { ReleaseRecordItem } from "./releaseRecord_data";

export async function GetReleaseRecord(params: any) {
    let req = await request<PageResponse<ReleaseRecordItem[]>>(`/v1/deployment/releaserecord`,
        {
            method: 'GET',
            params: params
        }
    )
    return new Promise<PageResponse<ReleaseRecordItem[]>>(x=>x(req))
}