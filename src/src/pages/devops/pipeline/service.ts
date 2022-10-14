import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';

export async function getAppLanguages() :Promise<any> {
    let req= await request<ApiResponse<any>>('/v1/application/applanguage',{
        method:'GET',
    })
   return new Promise(x=>x(req.data))
}

export async function getBuildImageByLanguageId(id: Number) :Promise<{label:string,value:string}[]> {
    let req= await request<ApiResponse<any>>('/v1/application/buildimagebylanguageid',{
        method:'GET',
        params:{
            languageId: id
        }
    })
   return new Promise(x=>x(req.data.map((lang:any) => ({ label: lang.aliasName, value: lang.compileImage }))))
}