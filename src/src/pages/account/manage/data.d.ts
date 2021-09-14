export type TableListItem = {
  id: number;
  tenantId?: number;
  userName: string;
  account: string;
  password: string;
  mobile: string;
  email: string;
  notifyCount: number;
  status: string;
  updateTime: Date;
  creationTime: Date;
  status: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  pageIndex: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
