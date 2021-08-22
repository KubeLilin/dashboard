import { IEntity } from "@/shard/entity/ibaseentity";
import { Guid } from "guid-typescript";
import { FieldTypeEnum } from "../fieldtype-enum"

/**
 Json文件读取基础配置
 * 
 */
export class ftpConfigDto {
    /**
     * 主机
     */
    host: string = "";
    /**
     * 用户名
     */
    userName: string = "";
    /**
     * 密码
     */
    passWord: string = "";
    /**
     * Ftp路径
     */
    targetfilePath: string = "";
    /**
     * 端口
     */
    prot: number = 0;
    /**
     * 是否忽略空文件
     */
    isIgnoreEmptyfile: boolean = false;
}
export class JsonReadConfigInputDto implements IEntity<string>{
    /**
     * 唯一主键
     */
    id: string = Guid.create().toString();
    /**
     * Json文件的字段路径
     */
    pathField: string = "asdas";
    /**
     * 流内字段名称
     */
    flowField: string = "asdasda";
    /**
     * 转换的字段类型
     */
    fieldType: FieldTypeEnum = FieldTypeEnum.string;
}
/**
 * 下载FTP文件，并读取到数据流中配置
 */
export class ReadJsonConfig{
    /**
     * Ftp配置
     */
    ftpConfig:ftpConfigDto=new ftpConfigDto();
    /**
     * Json读取配置
     */
    jsonReadConfig:Array<JsonReadConfigInputDto>=new Array<JsonReadConfigInputDto>();

}