import { ApiResponse } from '@/services/public/service';
import { request } from 'umi';

// PostSaveVolumes

export async function saveVolumes(formData: any){
    let resData = await request<ApiResponse<boolean>>("/v1/deployment/savevolumes", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        data:formData
    })
    return resData
}


export async function getVolumeAndMounts(deployId:number) {
    let req= await request<ApiResponse<any>>('/v1/deployment/volumes',{
        method:'GET',
        params: {
            deployId:deployId
        }
    })
   return req
}
