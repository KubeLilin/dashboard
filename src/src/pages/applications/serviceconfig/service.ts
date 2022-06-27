import success from "@/pages/result/success";
import { ApiResponse, PageResponse } from "@/services/public/service";
import { SortOrder } from "antd/lib/table/interface";
import { request } from "umi";
import { ServiceData, ServiceViewData } from "./data";
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
    let svcList: Array<ServiceViewData> = []
    if (req.success) {
        req.data.data.forEach(
            (x) => {
                let temp: ServiceViewData = {
                    name: x.name,
                    labels: JSON.stringify(x.labels),
                    selector: JSON.stringify(x.selector),
                    namespace: x.namespace,
                    type: x.type,
                    createTime:pareTime(x.createTime),
                    continueStr:x.continueStr
                };
                svcList.push(temp)
            }
        )
    }
    return new Promise(x => x({ data: svcList, success: req.success,total:req.data.total,msg:req.message }))
}

function  pareTime(date:Date):string {
   return moment(date.valueOf()).format('YYYY-MM-DD HH:mm:ss')
}

export async function BindNameSpace():Promise<any>{
    let req=await request<ApiResponse<any[]>>('/v1/service/namespacebytenant',{
        method:'GET',
    })
   let res= req.data.map(y => { return { value: y.namespace, label: y.namespace } })
   return new Promise(x=>x(res))
}
