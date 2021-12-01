import { ClusterItem } from "@/pages/resources/clusters/cluster_data";
import { ApiResponse } from "@/services/public/service";
import request from "umi-request";
export async function BindNamespace() {
    
}

export async function BindCluster() :Promise<any>{
    let resData = await request<ApiResponse<ClusterItem[]>>("/v1/cluster/list", {
        method: 'GET',
    })
    let data=  resData.data.map(x=>{return  {value:x.id,label:x.name}})
    return new Promise(x=>x(data))
}