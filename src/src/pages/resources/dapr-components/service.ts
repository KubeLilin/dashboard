import {request} from "umi";
import { ApiResponse } from "@/services/public/service";

export async function SaveDaprComponent(fromData:any) {
    let resData = await request<ApiResponse<any>>("/v1/runtime/saveDaprComponent",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        data:fromData
    })
    return resData
} 

export async function GetDaprComponentList() {
    let resData = await request<ApiResponse<any>>("/v1/runtime/daprComponentList",{
        method:'GET',
    })
    return resData
}

export async function DeleteDaprComponent(id:string) {
    let resData = await request<ApiResponse<any>>("/v1/runtime/daprcomponent",{
        method:'DELETE',
        params:{
            id:id
        }
    })
    return resData
}