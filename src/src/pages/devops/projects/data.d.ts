export type RecordType = {
    key: number;
    title: string;
    description: string;
    chosen: boolean;
}


export type createProjectItem = {
    name:string,
    appIdList:number[]
}


export type DevopsProjectItem = {
    id:number;
    name:string;
    createTime:string;
    appCount:number;
    appList:string;
}