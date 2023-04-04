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
