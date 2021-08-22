import { FieldTypeEnum } from './fieldtype-enum'
import { TaskTypeEnum,TaskTypeGroupEnum } from './tasktype-enum'

/**
 * 任务类型数组
 */
export const TaskTypeEnumList: Array<any> = [
    {
        label: "输入",
        value: TaskTypeGroupEnum.input,
        children: [
            {
                value: TaskTypeEnum.dataBase,
                label: "数据表输入",
            },
            {
                value: TaskTypeEnum.ftpjson,
                label: "Ftp-Json输入",
            },
            {
                value: TaskTypeEnum.excel,
                label: "Excel输入",
            }
        ]
    }
]
export const FieldTypeEnumList: Array<any> = [
    {
        label: "String",
        value: FieldTypeEnum.string,
    }
]