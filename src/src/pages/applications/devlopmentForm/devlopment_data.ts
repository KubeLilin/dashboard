export type DeploymentStep={
    id?:number,
    appId:number,
    name:string,
    nickname:string,
    level:string,
    clusterId:number,
    namespaceId:number,
    serviceEnable:number,
    serviceAway:string,
    servicePort:number
    replicas:number,
    requestCPU:number,
    requestMemory:number,
    limitCPU:number,
    limitMemory:number
}
