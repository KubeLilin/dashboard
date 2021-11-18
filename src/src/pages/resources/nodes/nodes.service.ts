import success from '@/pages/result/success';
import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { NodeItem } from './data';

export const getNodeList = async (
params: {
    pageIndex?: number;
    current?: number;
    pageSize?: number;
    cid?: number;
}, 
sort: Record<string, any>,
options?: { [key: string]: any },)=> {
    let resData=await request< ApiResponse<NodeItem[]>>("/v1/cluster/nodes",{
        method:'GET',
        params:params
    })
    
    return {
        data: resData.data,
        success: resData.success,
        total:  resData.data.length
    }
    
}