import { ApiResponse } from "@/services/public/service";
import request from "umi-request";
import { ExecDeploymentData } from "./execDeployment_data";

export async function RequestDeployment(params:ExecDeploymentData) {
    let req=await request<ApiResponse<string>>('/v1/deployment/executedeployment',{
        method:'POST',
        data:params,
        headers:{
            'Content-Type': 'application/json',
          },
    })
    return req
}