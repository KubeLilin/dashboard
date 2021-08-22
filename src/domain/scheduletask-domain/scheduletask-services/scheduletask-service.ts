import { ISelectListItem, IServerPageReturn, IServerReturn } from "../../../shard/ajax/response"

import BaseService from "../../baseservice/baseservice"
import IScheduleTaskService from "./ischeduletask-service"
import {ScheduletTaskInputDto} from "../scheduletask-entities/scheduleTaskentitie"
import { ScheduleTaskApi } from "@/domain/apiconfig"

export default class ScheduleTaskService extends BaseService implements IScheduleTaskService{
    update(_id: string, _param: ScheduletTaskInputDto): Promise<IServerReturn<any>> {
        return this.dataRequest.putRequest(`${ScheduleTaskApi.updateasync}/${_id}`,_param)
    }
    /**
     * 加载一个任务
     * @param _id 
     */
    getLoad(_id: string): Promise<IServerPageReturn<IServerReturn<any>>> {
        return this.dataRequest.getRequest(ScheduleTaskApi.getloadasync,{id:_id})
    }
    /**
     * 创建任务
     * @param _param 
     * @returns 
     */
    create(_param:ScheduletTaskInputDto): Promise<IServerReturn<any>> {
        return this.dataRequest.postRequest(ScheduleTaskApi.createasync,_param)
    }
    /**
     * 删除任务
     * @param _param 
     * @returns 
     */
    delete(_id:string): Promise<IServerReturn<any>> {
        debugger
        return this.dataRequest.deleteRequest(`${ScheduleTaskApi.deleteasync}/${_id}`)
    }
    /**
     * 分页获取数据
     * @param _param 
     * @returns 
     */
    getPage(): Promise<IServerPageReturn<any>> {
        return this.dataRequest.postRequest(ScheduleTaskApi.getpageasync,{})
    }
}