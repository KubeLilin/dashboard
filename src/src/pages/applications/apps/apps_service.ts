import { ApiResponse } from "@/services/public/service";
import { SortOrder } from "antd/lib/table/interface";
import request from "umi-request";
import { RequestOptionsType } from "_@ant-design_pro-utils@1.28.1@@ant-design/pro-utils";
import { ApplicationItem,ApplicationLevel,ApplicationModel } from "./apps_data";
export async function createApp(params:ApplicationModel){
    let req=await request<ApiResponse<ApplicationModel>>('/v1/application/createapp',{
        method:'POST',
        data:params,
        headers:{
            'Content-Type': 'application/json',
          },
    })
    return req
}

export async function updateApp(params:ApplicationModel){
    let req=await request<ApiResponse<number>>('/v1/application/editapp',{
        method:'PUT',
        data:params,
        headers:{
            'Content-Type': 'application/json',
          },
    })
    return req
}

export async  function getAppLevel():Promise<RequestOptionsType[]> {
    let req= await request<ApiResponse<ApplicationLevel[]>>('/v1/application/applevel',{
        method:'GET',
    })
   let data=  req.data.map(x=>{return  {value:x.id,label:x.name}})
   return new Promise(x=>x(data))
}


export async  function bindAppLevel():Promise<RequestOptionsType[]> {
    let req= await request<ApiResponse<ApplicationLevel[]>>('/v1/application/applevel',{
        method:'GET',
    })
   let data=  req.data.map(x=>{return  {value:x.id,label:x.name}})
   return new Promise(x=>x(data))
}

export async function getAppLanguage():Promise<RequestOptionsType[]> {
    let req= await request<ApiResponse<ApplicationLevel[]>>('/v1/application/applanguage',{
        method:'GET',
    })
   let data=  req.data.map(x=>{return  {value:x.id,label:x.name}})
   return new Promise(x=>x(data))
}

export async function getApps(params:{
    pageSize?: number;
    current?: number;
    pageIndex?:number;
  },sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>): Promise<any> {
      params.pageIndex=params.current
    let req= await request<ApiResponse<any>>('/v1/application/applist',{
        method:'GET',
        params:params
    })
   return new Promise(x=>x({data:req.data.data,success:req.success,total:req.data.total}))
}

