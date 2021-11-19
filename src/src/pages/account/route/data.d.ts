

export type MenuListItem = {
    id?: number;
    name?:string;
    path?:string;
    icon?:string;
    parentId?: number;
    isRoot?:number;
    status?: number;
    sort?: number
    routes?: MenuListItem[]
};


export type TableListPagination = {
    tenantId: number;
    total: number;
    pageSize: number;
    pageIndex: number;
};