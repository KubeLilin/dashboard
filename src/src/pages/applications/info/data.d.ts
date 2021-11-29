
export type DeploymentItem={
    id:number,
    name:string,
    nickname: string,
    clusterName:string,
    namespace: string,
    status: string,
    lastImage: string,
    running:number,
    expected:number,
    serviceIP: string,
    serviceName: string,
}