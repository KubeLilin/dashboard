import { ApiResponse,PageResponse ,PageInfo } from '@/services/public/service';
import { request } from 'umi';
import { DeploymentItem ,PodItem } from './data';

export async function getDeploymentList(
    params: {
        pageIndex?: number;
        current?: number;
        pageSize?: number;
        appid?: number;
        name?: string;
    }, ):Promise<PageInfo<DeploymentItem[]>> {

        let resData=await request< PageResponse<DeploymentItem[]>>("/v1/deployment/list",{
            method:'GET',
            params:params
        })
        
    return new Promise(x=>x( resData.data ))
    
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

export async function GetApplicationInfo(appid:number) {
    let resData = await request<ApiResponse<any>>("/v1/application/info",{
        method:'GET',
        params:{ appid: appid }
    })
    return resData
}


export async function GetAppGitBranches(appid:number) {
    let resData = await request<ApiResponse<string[]>>("/v1/application/gitbranches",{
        method:'GET',
        params:{ appid: appid }
    })
    return resData
}