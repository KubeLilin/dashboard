export type DeploymentStep={
    id?:number,
    appId?:number,
    name?:string,
    nickname:string,
    level:string,
    clusterId:number,
    namespaceId:number,
    serviceEnable:boolean,
    serviceAway:string,
    servicePort:number
    replicas:number,
    requestCpu:number,
    requestMemory:number,
    limitCpu:number,
    limitMemory:number,
    clusterSelect:any
}
