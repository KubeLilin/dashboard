import {request} from "umi";
import { ApiResponse } from "@/services/public/service"


export async function GetDaprComponentList(cid:number,namespace:string) {
    let resData = await request<ApiResponse<any>>("/v1/runtime/daprResourceList",{
        method:'GET',
        params:{
            clusterId:cid,
            namespace:namespace
        }
    })
    return resData
}

export async function GetDaprComponentTypeList() {
    let resData = await request<ApiResponse<any>>("/v1/runtime/daprComponentTypeList",{
        method:'GET',
    })
    return resData
}

// GetDaprComponentTemplateByType
export async function GetDaprComponentTemplateByType(type:string) {
    let resData = await request<ApiResponse<any>>("/v1/runtime/daprComponentTemplateByType",{
        method:'GET',
        params:{
            componentType:type
        }
    })
    return resData
}

//CreateOrUpdateDaprComponent
export async function CreateOrUpdateDaprComponent(formdata:any) {
    let resData = await request<ApiResponse<any>>("/v1/runtime/createOrUpdateDaprComponent",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        data:formdata
    })
    return resData
}

//DeleteDaprComponent 
export async function DeleteDaprComponent(cid:number,namespace:string,name:string) {
    let resData = await request<ApiResponse<any>>("/v1/runtime/daprComponentResource",{
        method:'DELETE',
        params:{
            clusterId:cid,
            namespace:namespace,
            name:name
        }
    })
    return resData
}