export type ApplicationItem={
    id:number,
    name:string,
    tenantId:number,
    labels:string,
    remarks:string,
    git:string,
    level:number,
    levelName:string,
    language:number,
    languageName:string,
    status:number
    sCID:number
    sources:number
    sourceType:string
    deployCount:number
}

export type ApplicationLevel={
    id:number,
    code:string,
    name:string,
    sort:number
}

export type ApplicationModel={
    id:number,
    name:string,
    tenantId:number,
    labels:string,
    remarks:string,
    git:string,
    level:number,
    language:number,
    status:number
}