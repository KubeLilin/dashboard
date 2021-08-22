import * as MenuEnum from "../menu-entities/EMenuType";

export interface IRoute {
    /**
     * 菜单名
     */
    name: string;
    /**
     * 路径
     */
    path: string;
    /**
     * 对应组件
     */
    component: string;
    /**
     * 组件名
     */
    componentName: string;
    meta?: IMetaBase;
}
export interface IMenuOther {
    /**
     * 是否显示
     */
    isShow: boolean;
    /**
     * 按钮事件
     */
    buttonClick: string;
    /**
     * 菜单类型
     */
    menuEnum: MenuEnum.EMenuType;
}
export interface IMenu extends IRoute, IMenuOther {
    id: string;
    /**
     * 菜单父级Id
     */
    parentId: string;
    /**
     * 菜单icon
     */
    icon: string;
    /**
     * 当前菜单以上所有的父级
     */
    parentNumber: string;
    /**
     * 当前菜单对应的子应用
     */
    microName: string;
    /**
     * 英文名
     */
    eName: string;
}
export interface IMetaBase {
    title: string;
}
export interface IMenuOpInst extends IMenu {
    /**
     * 子级
     */
    children: IMenuOpInst[];
    /**
     * tab页
     */
    tabs: IMenuOpInst[];
    /**
     * 按钮列表
     */
    buttons: IMenuOpInst[];
}