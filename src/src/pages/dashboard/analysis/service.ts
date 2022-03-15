import { request } from 'umi';
import type { NoticeType, ActivitiesType, AnalysisData } from './data';

export async function queryProjectNotice(): Promise<{ data: NoticeType[] }> {
  return request('/api/project/notice');
}

export async function queryActivities(): Promise<{ data: ActivitiesType[] }> {
  return request('/api/activities');
}

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/api/fake_workplace_chart_data');
}


export async function BindCluster() :Promise<{label: string,value: string}[]> {
  let resData = await request<any>("/v1/cluster/list", {
      method: 'GET',
  })
  let data=  resData.data.map(x=>{return  {value:x.id,label:x.name}})
  return new Promise(x=>x(data))
}