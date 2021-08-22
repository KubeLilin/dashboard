import { IEntity } from "../../../shard/entity/ibaseentity"
import {TaskTypeEnum } from "./tasktype-enum"

/**
 任务管理基类
 * 
 */
export class ScheduletTaskBase implements IEntity<string> {
    id: string = "";
    taskNumber: string = "";
    taskName: string = "";
    taskType: TaskTypeEnum = TaskTypeEnum.ftpjson;
    taskConfig: string = "";
    describe: string = "";
}
/**
 * 输入Dto
 */
export class ScheduletTaskInputDto extends ScheduletTaskBase {

}

/**
 * 数据来源设置Dto
 * 
 */
export class ScheduletTaskSourceDto {
    /**
      * 数据来源链接Id
    */
    sourceId: string = "";
    /**
     * 数据来源表
     */
    sourceTable: Array<string> = [];
    /**
     * 查询语句
     */
    sqlQuery: string = "";
}
/**
 * 数据目标设置Dto
 * 
 */
export class ScheduletTaskTargerDto {
    /**
      * 数据来源链接Id
    */
    targerId: string = "";
    /**
     * 数据目标表
     */
    targerTable: string = "";
    /**
     * 每批提交行数
     */
    everySubmitNumber: number = 5000;
    /**
     * 提交方式
     */
    submitType: number = 5000;
    /**
     * 写入前操作
     */
    targerWriteBeforOperationType: number = 0;
    /**
     * 目标表删除语句
     */
    targerTableDeleteStatement:string="";
    /**
     * 判断目标表是否存在不存在则创建
     */
    targerExistTable:boolean=false;
    /**
     * 创建目标表语句
     */
    createTableStatement:string="";
    /**
     * 删除数据关系字段
     */
    DeleteRelationField:string="";
}


