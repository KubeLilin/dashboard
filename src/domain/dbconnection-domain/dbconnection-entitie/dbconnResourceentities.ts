import { IEntity } from "../../../shard/entity/ibaseentity"

/**
 * 元数据类型
 */
export enum MetaDataTypeEnum {
    /**
     * 表
     */
    metaDataTable = 0,
    /**
     * 视图
     */
    metaDataView = 5,
    /**
     * 列
     */
    metaDataColunm = 10,
}

export class DBConnResourceBase implements IEntity<string> {
    id: string = "";
    host: string = "";
    connectionName: string = "";
    port: number = 0;
    userName: string = "";
    passWord: string = "";
    dbType: string = "";
    maxConnSize: number = 0;
    memo: string = "";
}
export class DBConnResourceInputDto extends DBConnResourceBase {

}
/**
 * 元数据导入
 */
export class MetaDataImportInputDto implements IEntity<string>{
    /**
     * 数据连接Id
     */
    id: string = "";
    /**
     * 数组
     */
    metaDatas:Array<MetaDataInputDto>=[];
}
/**
 * 元数据导入
 */
export class MetaDataInputDto {
    /**
     * 名称
     */
    name: string = "";
    /**
     * 源数据类型
     */
    MetaDataType: MetaDataTypeEnum = MetaDataTypeEnum.metaDataColunm;
}