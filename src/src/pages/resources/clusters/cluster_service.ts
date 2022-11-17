import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { ClusterItem } from './cluster_data';

export async function getClusterList(params: {
    pageIndex?: number;
    pageSize?: number;
    current?: number;
}, sort: Record<string, any>, filter: any) {
    let resData = await request<ApiResponse<ClusterItem>>("/v1/cluster/list", {
        method: 'GET',
        params: params
    })
    return new Promise<any>(x => {
        x(resData)
    })
}

export async function importConfigFile(file: any,name:string){
    const formData = new FormData()
    formData.append('name',name)
    formData.append('file1',file)
    let resData = await request<ApiResponse<boolean>>("/v1/cluster/clusterByConfig", {
        method: 'POST',
        body:formData
    })
    return resData
}

export async function removeCluster(id:number){
    let resData=await request<ApiResponse<boolean>>(`/v1/cluster/delclusterinfo?id=${id}`, {
        method: 'DELETE',
    })
    return resData
}