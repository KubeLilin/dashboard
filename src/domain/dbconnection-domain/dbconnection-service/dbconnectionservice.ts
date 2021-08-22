import { DBConnResourceInputDto, MetaDataImportInputDto } from "../dbconnection-entitie/dbconnResourceentities"
import { ISelectListItem, IServerPageReturn, IServerReturn } from "../../../shard/ajax/response"

import BaseService from "../../baseservice/baseservice"
import {DbconnApi} from "../../apiconfig/index"
import IDbConnectionService from "./idbconnectionservice"
import { TreeDto } from "@/shard/entity/treedto"

export default class DbConnectionService extends BaseService implements IDbConnectionService {
    importmetadata(_param: MetaDataImportInputDto): Promise<IServerReturn<any>> {
        debugger
        return this.dataRequest.postRequest(DbconnApi.importmetadataasync,_param)
    }
    getmetadata(): Promise<IServerReturn<Array<TreeDto>>> {
        return this.dataRequest.getRequest(DbconnApi.getmetadataasync,)
    }
    getselectlistitem(): Promise<IServerReturn<Array<ISelectListItem>>> {
        return this.dataRequest.getRequest(DbconnApi.selectlistitemasync);
    }
    getPage(): Promise<IServerPageReturn<any>> {
        return this.dataRequest.postRequest(DbconnApi.getpage,{})
    }
    create(_param:DBConnResourceInputDto): Promise<IServerReturn<any>> {
        return this.dataRequest.postRequest(DbconnApi.createasync,_param)
    }
}