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