import { IMenuOpInst } from "../../domain/menu-domain/menu-entities/IMenu";
import {Layout} from "antd";
import Menus from "../../component/menu-tab";
import React from "react";

class LayoutSider extends React.Component<{ menus: IMenuOpInst[] }> {
    render() {
      return (
        <Layout.Sider>
          <Menus menus={this.props.menus} />
        </Layout.Sider>
      )
    }
  }
  
  export default LayoutSider;