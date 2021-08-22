import { Button, Layout } from 'antd';
import React, { Component } from 'react'
import ApplicationUserManager from "@/shard/ids4-oidc-login/IdentityServerLogin"
export default class Layoutheader extends Component {
    // logout = () => {
    //     localStorage.removeItem("token");
    //     ApplicationUserManager.outLogin();
    // }
    render() {
        return (
            <div>
                <Layout.Header className="sukt-layout__header">
                    <Button ghost={true} onClick={() => { ApplicationUserManager.outLogin()}} type="primary" >退出登录</Button>
                </Layout.Header>
            </div>
        )
    }
}
