import success from '@/pages/result/success';
import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { DeploymentItem } from './data';

export const getDeploymentList = async (
params: {
    pageIndex?: number;
    current?: number;
    pageSize?: number;
    appid?: number;
    name?: string;
}, 
sort: Record<string, any>,
options?: { [key: string]: any },)=> {
    let resData=await request< ApiResponse<DeploymentItem[]>>("/v1/deployment/list",{
        method:'GET',
        params:params
    })
    
    return {
        data: resData.data,
        success: resData.success,
        total:  resData.data.length
    }
    
}