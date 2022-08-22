import { request } from 'umi';
import { ApiResponse } from '@/services/public/service';
import { ClusterMetricsInfo,WorkloadsMetricsInfo,ProjectsMetricsInfo,NamespcaeInfo  } from './data';


export async function BindCluster() :Promise<{label: string,value: string}[]> {
  let resData = await request<any>("/v1/cluster/list", {
      method: 'GET',
  })
  let data=  resData.data?.map(x=>{return  {value:x.id,label:x.name}})
  return new Promise(x=>x(data))
}


export async function GetClusterMetrics(clusterId:number)  {
  let resData = await request<ApiResponse<ClusterMetricsInfo>>("/v1/metrics/statistics", {
      method: 'GET',
      params: { cid: clusterId }
  })
  return resData
}

export async function GetWorkloadsMetrics(clusterId:number)  {
  let resData = await request<ApiResponse<WorkloadsMetricsInfo>>("/v1/metrics/workloads", {
      method: 'GET',
      params: { cid: clusterId }
  })
  return resData
}


export async function GetProjectsMetrics( )  {
  let resData = await request<ApiResponse<ProjectsMetricsInfo>>("/v1/metrics/projects", {
      method: 'GET',
  })
  return resData
}



export async function GetNameSpaceList(clusterId:number,tentantName:string,pageIndex:number,pageSize:number) {
  let resData = await request<any>("/v1/cluster/namespacelist", {
      method: 'GET',
      params:{'cid':clusterId , 'tenant': tentantName , 'current': pageIndex, 'pageSize':pageSize }
  })
  return { 
      data: resData.data.data,
      success : resData.success,
      total : resData.data.total,
  }
}