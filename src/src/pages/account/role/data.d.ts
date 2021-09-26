export type TableListItem = {
    id: number;
    roleCode?: string;
    roleName?: string;
    tenantId?: number;
    status?: number;
  };
  
export type MenuListItem = {
    id?: number;
    menuCode?: string;
    menuName?: string;
    tenantID?: number;
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

export type CreateOrUpdateRoleMenuRequest = {
  roleMenuList?:roleMenuItem[];
}

export type roleMenuItem = {
  roleId:number;
  menuId:number;
}