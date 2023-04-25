import success from '@/pages/result/success';
import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';
import { EventsList, PodItem ,podLogsRequest,EventListProps,ServiceInfo,ServicePort } from './data';

export const getNamespaceList = async(cid?:string)=>{
    const params = {
        cid:cid
    }
    let resData=await request< ApiResponse<any[]>>("/v1/cluster/namespacesfromdb",{
        method:'GET',
        params:params
    })

    return resData.data.map(item =>   {  return  {label: item.namespace, value: item.namespace } } )
}


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
        console.log(resData)
        if (resData.data == null){
            resData.data = []
        }  
        return {
            data: resData.data,
            success: resData.success,
            total:  resData.data.length
        }
        
    }


    export const setReplicasByDeployId = (deployId:number, replicas:number) =>{
        return request< ApiResponse<any>>("/v1/deployment/replicasbyid",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data:{
                deployId: deployId,
                number: replicas
            }
        })
    }


    export async function GetDeploymentFormInfo(id?:number) {
        let req=await request<ApiResponse<any>>(`/v1/deployment/deploymentforminfo?dpId=${id}`,{
            method:'GET',
        })
        return req
    }


    export const destroyPod = (requestData:any) =>{
        return request< ApiResponse<any>>("/v1/deployment/destroypod",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data:requestData
        })
    }

    export const getPodLogs = async (req:podLogsRequest) => {
        let resData= await request< ApiResponse<string[]>>("/v1/deployment/podlogs",{
            method:'GET',
            params:req
        })
        if (!resData){
            return []
        }

        return resData.data
    }

    export const getEventList = async(req:EventListProps) => {
        let resData= await request< ApiResponse<EventsList[]>>("/v1/deployment/events",{
            method:'GET',
            params:req
        })
        return resData
    }

    export async function getYaml(dpId:any,cid:number,namespace:string,dpName:string) {
        let req=await request<ApiResponse<string>>("/v1/deployment/yaml",{
            method:'GET',
            params:{
                dpId:dpId,
                cid:cid,
                namespace:namespace,
                dpName:dpName
            }
        })
        return req
    }


    export async function DeleteDeploymentWithOutDB(dpId:number,clusterId:number,namespace:string,appName:string) {
        let req=await request<ApiResponse<string>>("/v1/deployment/DeploymentWithOutDB",{
            method:'DELETE',
            params:{dpId:dpId,cid:clusterId,namespace:namespace,dpName:appName}
        })
        return req
    }


    export async function getServiceInfo(params:{clusterId:number,namespace:string,name:string}) {
        let req=await request<ApiResponse<ServiceInfo[]>>('/v1/service/info',{
            method:'GET',
            params:params,
        });
        return req;
    }

    export async function getGatewayRouterList(params: any) {
        let req= await request<ApiResponse<any>>('/v1/apigateway/routerlistBy',{
            method:'GET',
            params: params
        })
       return req
    }