
export type DeploymentItem={
    id:number,
    name:string,
    nickname: string,
    clusterName:string,
    clusterId:number,
    namespace: string,
    status: string,
    lastImage: string,
    running:number,
    expected:number,
    serviceIP: string,
    servicePort:number,
    serviceName: string,
    appName:string,
    runtime:string,
}


export type PodItem = {
    namespace : string,
    name :string,
    ip:string,
    hostIP:string,
    podCount:number,
    podReadyCount:number,
    startTime :string,
    age: Date,
    status: string,
    restarts:number,
    containers : ContainerItem[]
}


export type ContainerItem = {
    id :string,
    name :string,
    image : string,
    state : string,
    ready : boolean,
    restartCount : number,
    Started: boolean
}


export type PipelineInfo  = {
    appid: number,
    language:string,
    id: number,
    name: string,
    dsl: string,
    status: number,
    taskid: string,
    lastCommit: string,
}