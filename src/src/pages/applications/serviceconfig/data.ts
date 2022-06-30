export  type ServiceData={
    namespace:string
    name:string
    type:string
    labels:any
    selector:any
    createTime:Date
    continueStr:string
}


export  type ServiceViewData={
    namespace:string
    name:string
    type:string
    labels:string
    selector:string
    createTime:string
    continueStr:string
}


export type ServiceInfo={
    namespace:string
    name:string
    type:string
    labels:string
    selector:string
    createTime:string
    clusterIp:string,
    port:ServicePort[]
}

export type ServicePort={
    index:number,
    name:string,
    protocol:string,
    port:number,
    targetPort:number

}
