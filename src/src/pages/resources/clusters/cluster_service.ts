import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { ClusterItem } from './cluster_data';

export async function getClusterList(params: {
    pageIndex?: number;
    pageSize?: number;
    current?: number;
},sort:Record<string, any>,filter:any) {
    let resData=await request< ApiResponse<ClusterItem>>("/v1/cluster/list",{
        method:'GET',
        params:params
    })
    return new Promise<any>(x=>{
        x(resData)
    })
    
}