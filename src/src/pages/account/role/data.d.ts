export type TableListItem = {
    id: number;
    roleCode?: string;
    roleName?: string;
    tenantId: number;
    status: number;
  };
  
export type MenuListItem = {
    id: number;
    menuCode?: string;
    menuName?: string;
    tenantId: number;
    status: number;
  };

export type TableListPagination = {
  total: number;
  pageSize: number;
  pageIndex: number;
};