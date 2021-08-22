import { ISelectListItem, IServerPageReturn, IServerReturn } from "../../../shard/ajax/response"

import {ScheduletTaskInputDto} from "../scheduletask-entities/scheduleTaskentitie"

export default interface IScheduleTaskService{
    /**
     * 创建任务
     * @param _param 
     */
    create(_param:ScheduletTaskInputDto): Promise<IServerReturn<any>>;
    /**
     * 修改任务
     * @param _param 
     */
    update(_id:string,_param:ScheduletTaskInputDto): Promise<IServerReturn<any>>;
    getPage(): Promise<IServerPageReturn<any>> ;
    /**
     * 加载一个任务
     * @param _id 
     */
    getLoad(_id:string): Promise<IServerPageReturn<IServerReturn<any>>> ;
    /**
     * 删除任务
     * @param _id 
     */
    delete(_id:string): Promise<IServerReturn<any>> ;
}