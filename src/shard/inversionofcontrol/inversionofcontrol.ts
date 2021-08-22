import { Aantvx6GraphService } from "@/domain/antvx6-domain/antvx6graph-services/antvx6graphservice";
import { Container } from "inversify";
import DbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/dbconnectionservice"
import IAntvx6GraphService from "@/domain/antvx6-domain/antvx6graph-services/iantvx6graphservice";
import IDbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/idbconnectionservice"
import IScheduleTaskService from "@/domain/scheduletask-domain/scheduletask-services/ischeduletask-service"
import { IocTypes } from "./ioc-config-types"
import ScheduleTaskService from "@/domain/scheduletask-domain/scheduletask-services/scheduletask-service"

const ioccontainer = new Container();
ioccontainer.bind<IAntvx6GraphService>(IocTypes.Aantvx6GraphService).to(Aantvx6GraphService)
ioccontainer.bind<IDbConnectionService>(IocTypes.DbConnectionService).to(DbConnectionService)
ioccontainer.bind<IScheduleTaskService>(IocTypes.ScheduleTaskService).to(ScheduleTaskService)
export default ioccontainer;