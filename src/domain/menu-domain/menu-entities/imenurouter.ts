export interface IMenuRoute {
    id: string;
    name: string;
    path: string;
    component?: any;
    exact?: boolean;
    redirect?: string;
    children: IMenuRoute[];
    isShow: boolean;
}