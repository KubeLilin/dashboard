import DataRequest from "../../data-request-repository";
import IBaseservices from "./ibaseservice";
import { IDataRequest } from "../../data-request-repository";
import { injectable } from "inversify";
import request from "../../shard/utils/axios-request"

@injectable()
export default class BaseService implements IBaseservices {
  dataRequest: IDataRequest = DataRequest.Inst(request);
}
