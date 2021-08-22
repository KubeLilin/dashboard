import { DBConnResourceInputDto, MetaDataImportInputDto } from "../dbconnection-entitie/dbconnResourceentities"
import { ISelectListItem, IServerPageReturn, IServerReturn } from "../../../shard/ajax/response";

import { TreeDto } from "../../../shard/entity/treedto";

export default interface IDbConnectionService {
    /**
     * 分页获取
     */
    getPage():Promise<IServerPageReturn<any>>;
    /**
     * 创建数据连接
     * @param _param 
     */
    create(_param:DBConnResourceInputDto): Promise<IServerReturn<any>>;
    /**
     * 获取数据连接下拉框
     */
    getselectlistitem(): Promise<IServerReturn<Array<ISelectListItem>>>;
    /**
     * 获取元数据
     */
    getmetadata(): Promise<IServerReturn<Array<TreeDto>>>;
    /**
     * 获取元数据
     */
    importmetadata(_param:MetaDataImportInputDto): Promise<IServerReturn<any>>;
}