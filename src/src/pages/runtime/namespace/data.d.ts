export type TenantTableListItem={
    id:number,
    tCode:string,
    tName:string,
    status:number,
}

export type TenantTableListPagination = {
    total: number;
    pageSize: number;
    pageIndex: number;
  };

export type NamespaceInfo={
  id : number,
  tenantId:number,
	clusterId: number,
	tenantCode: string,
	clusterName :string,
	namespace :string,
	tenantName:string,
  enableRuntime:boolean,
  runtimeName:string,
  deployCount:number,
  quotasSpec: QuotasSpec[]
}

export type QuotasSpec = {
	name:string ,
	displayValue:string  ,
	displayUsedValue:string  ,
	limitValue:number   ,
	usedValue:number   ,
}

export type NewQuota = {
  namespace: string,
  cpu:number,
  memory:number,
  pods:number,
}