import "./layout-view.less"

import React, { Component } from "react";

import { BrowserRouter } from "react-router-dom";
import { IMenuRoute } from "../domain/menu-domain/menu-entities/imenurouter";
import {Layout} from "antd";
import LayoutSider from "./layout-sider/layout-sider";
import Layoutheader from './layout-header/layout-header';
import {menuList} from "../domain/menu-domain/mock/menumock"
import { renderRoutes } from "react-router-config";

interface IProp {
    route:IMenuRoute;
}
/**
 * 登录之后的模板页
 */
export default class LayoutView extends Component<IProp, { routes:IMenuRoute[] }> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            routes: props.route.children
        };

    }
    render() {
        return (
            <Layout className="etl-layout">
                <BrowserRouter>
                    <LayoutSider menus={menuList} />
                    <Layout>
                        <Layoutheader />
                        <Layout.Content>
                            {renderRoutes(this.state.routes)}
                        </Layout.Content>
                        <Layout.Footer className="sukt-layout__footer">VV大佬盛情出品</Layout.Footer>
                    </Layout>
                </BrowserRouter>
            </Layout>
        )
    }
}
