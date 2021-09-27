

export type MenuListItem = {
    id?: number;
    menuCode?: string;
    menuName?: string;
    tenantID?: number;
    path?:string;
    icon?:string;
    parentId?: number;
    isRoot?:number;
    status?: number;
    sort?: number

    parentText?:string;

    routes?: MenuListItem[]
};


export type TableListPagination = {
    tenantId: number;
    total: number;
    pageSize: number;
    pageIndex: number;
};