import success from "@/pages/result/success";
import { ApiResponse, PageResponse } from "@/services/public/service";
import { SortOrder } from "antd/lib/table/interface";
import { request } from "umi";
import { ServiceData, ServiceViewData } from "./data";

export async function queryServiceList(params: {
    pageSize?: number;
    current?: number;
    pageIndex?: number;
}, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>): Promise<any> {
    let req = await request<PageResponse<ServiceData[]>>("/v1/service/servicelist", {
        method: 'GET',
        params: params
    })
    let svcList: Array<ServiceViewData> = []
    if (req.success) {
        req.data.data.forEach(
            (x) => {
                console.log(x.createTime)
                let temp: ServiceViewData = {
                    name: x.name,
                    labels: JSON.stringify(x.labels),
                    selector: JSON.stringify(x.selector),
                    namespace: x.namespace,
                    type: x.type,
                    createTime:x.createTime

                };
                svcList.push(temp)
            }
        )
    }
    return new Promise(x => x({ data: svcList, success: req.success,total:req.data.total }))
}