import success from '@/pages/result/success';
import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { PodItem } from './data';


export const getPodList = async (
    params: {
        pageIndex?: number;
        current?: number;
        pageSize?: number;
        cid?:number;
        node?: string;
    }, 
    sort: Record<string, any>,
    options?: { [key: string]: any },)=> {
        let resData=await request< ApiResponse<PodItem[]>>("/v1/cluster/pods",{
            method:'GET',
            params:params
        })
        
        return {
            data: resData.data,
            success: resData.success,
            total:  resData.data.length
        }
        
    }