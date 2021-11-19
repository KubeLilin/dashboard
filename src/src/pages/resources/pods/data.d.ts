export type PodItem = {
    namespace : string,
    name :string,
    ip:string,
    hostIP:string,
    podCount:number,
    podReadyCount:number,
    age:number,
    status: string,
    restarts:number
}


export type NamespaceItem = {
    name : string
}