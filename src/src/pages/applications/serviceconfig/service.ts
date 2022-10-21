import success from "@/pages/result/success";
import { ApiResponse, PageResponse } from "@/services/public/service";
import { SortOrder } from "antd/lib/table/interface";
import { request } from "umi";
import { ServiceData, ServiceInfo, ServiceViewData } from "./data";
import moment from "moment";
import { NamespaceInfo } from "@/pages/resources/namespaces/data";
export async function queryServiceList(params: {
    pageSize?: number;
    current?: number;
    pageIndex?: number;
}): Promise<any> {
    let req = await request<PageResponse<ServiceData[]>>("/v1/service/servicelist", {
        method: 'GET',
        params: params
    })
    console.log(req)
    let svcList: Array<ServiceViewData> = []
    if (req.success) {
        if (req.data.data) {
            req.data.data.forEach(
                (x) => {
                    let temp: ServiceViewData = {
                        name: x.name,
                        labels: JSON.stringify(x.labels),
                        selector: JSON.stringify(x.selector),
                        namespace: x.namespace,
                        type: x.type,
                        clusterIP:x.clusterIP,
                        sessionAffinity:x.sessionAffinity,
                        createTime:pareTime(x.createTime),
                        continueStr:x.continueStr
                    };
                    svcList.push(temp)
                }
            )
        } else {
            svcList=[]
        }
    }
    return new Promise(x => x({ data: svcList, success: req.success,total:req.data.total,msg:req.message }))
}

function  pareTime(date:Date):string {
   return moment(date.valueOf()).format('YYYY-MM-DD HH:mm:ss')
}

export async function BindNameSpace(clusterId:number):Promise<any>{
    let req=await request<ApiResponse<any[]>>('/v1/service/namespacebytenant',{
        method:'GET',
        params:{
            clusterId:clusterId
        }
    })
   let res= req.data.map(y => { return { value: y.namespace, label: y.namespace } })
   return new Promise(x=>x(res))
}

export async function getServiceInfo(params:{namespace:string,name:string}) {
    let req=await request<ApiResponse<ServiceInfo>>('/v1/service/info',{
        method:'GET',
        params:params,
    });
    return req;
}

export async function ApplyService(params:ServiceInfo) {
    console.log(params);
    let req=await request<ApiResponse<ServiceInfo>>('/v1/service/changeservice',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
          },
        data:params,
    });
    return req;
    
}

export async function getClusterList() :Promise<any>{
    let resData = await request<ApiResponse<any[]>>("/v1/cluster/list", {
        method: 'GET',
    })
    let data=  resData.data?.map(x=>{return  {value:x.id,label:x.name}})
    return new Promise(x=>x(data))
}