export type TenantTableListItem={
    Id:number,
    tCode:string,
    tName:string,
    status:number,
}

export type TenantTableListPagination = {
    total: number;
    pageSize: number;
    pageIndex: number;
  };