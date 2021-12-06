export type ClusterItem = {
    id: number,
    teanantId: number,
    name: string,
    version: string,
    distrbution: string,
    sort?: number,
    status: number
}

export type K8sNamespcae={
    name:string,
    status:string,
}