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
    restarts:number
    usage:any
    containers: ContainerItem[]
}


export type ContainerItem = {
    id: string,
    name: string,
    image: string,
    ready: any,
    started: any,
    state: string,
    restartCount: number
}

export type NamespaceItem = {
    name : string
}

export type podLogsRequest = {
    clusterId: number,
    namespace?: string,
    podName?: string,
    containerName?:string ,
    lines:number
}


export type EventsList = {
    firstTime: string,
	lastTime: string,
	name: string
	level: string
	reason :string
	infomation: string
	kind: string
}

export type  EventListProps = {
    clusterId?:number,
    namespace?:string,
    deployment?:string,
}


export type ServiceInfo={
    namespace:string
    name:string
    type:string
    labels:string
    selector:string
    createTime:string
    clusterIP:string
    sessionAffinity:string
    port:ServicePort[]
}

export type ServicePort={
    index:number,
    name:string,
    protocol:string,
    port:number,
    targetPort:number
    nodePort:number

}
