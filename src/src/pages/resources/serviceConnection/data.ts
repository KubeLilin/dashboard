export type ServiceConnectionItem={
    id:number,
    tenantId:number,
    name:string,
    serviceType:number,
    type:number,
    detail:string
}

export type RepoServiceConnection={
    name: string
    repo: string
    userName: string
    password: string
    token: string
    type: number
}