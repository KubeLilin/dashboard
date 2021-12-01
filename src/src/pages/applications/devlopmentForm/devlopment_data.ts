export type DeploymentStep1={
    name:string,
    level:string,
    clusterId:number,
    namespaceId:number,
    serviceEnable:number,
    serviceAway:string,
    servicePort:number
}

export type DeploymentStep2={
    replicas:number,
    requestCPU:number,
    requestMemory:number,
    limitCPU:number,
    limitMemory:number
}