import success from '@/pages/result/success';
import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { DeploymentItem ,PodItem } from './data';

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

export async function executeDeployment(dpId:any) {
    let req=await request<ApiResponse<any>>("/v1/deployment/executedeployment",{
        method:'POST',
        params:{dpId:dpId}
    })
    return req
}


export const getPodList = async (appName:string , clusterId:number , index :number)=> {
        let resData=await request< ApiResponse<PodItem[]>>("/v1/cluster/pods",{
            method:'GET',
            params:{ app: appName , cid: clusterId }
        })
        console.log(resData)
        if (resData.data == null){
            return { index:index, data: null }
        }  
        return { index:index, data: resData.data }
    }