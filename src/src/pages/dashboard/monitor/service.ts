import { request } from 'umi';
import type { TagType } from './data';

export async function queryTags(): Promise<{ data: { list: TagType[] } }> {
  return request('/api/tags');
}



export async function BindCluster() :Promise<{label: string,value: string}[]> {
  let resData = await request<any>("/v1/cluster/list", {
      method: 'GET',
  })
  let data=  resData.data.map(x=>{return  {value:x.id,label:x.name}})
  return new Promise(x=>x(data))
}