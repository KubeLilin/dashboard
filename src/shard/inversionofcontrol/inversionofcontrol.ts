import { Container } from "inversify";
import DbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/dbconnectionservice"
import IDbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/idbconnectionservice"
import IScheduleTaskService from "@/domain/scheduletask-domain/scheduletask-services/ischeduletask-service"
import { IocTypes } from "./ioc-config-types"
import ScheduleTaskService from "@/domain/scheduletask-domain/scheduletask-services/scheduletask-service"

const ioccontainer = new Container();
ioccontainer.bind<IDbConnectionService>(IocTypes.DbConnectionService).to(DbConnectionService)
ioccontainer.bind<IScheduleTaskService>(IocTypes.ScheduleTaskService).to(ScheduleTaskService)
export default ioccontainer;