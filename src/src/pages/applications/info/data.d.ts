
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
    serviceName: string,
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