import {UserManager}  from "oidc-client"

console.log(process)
export class ApplicationUserManager extends UserManager{
    constructor(){
        super({
            authority:process.env.REACT_APP_AUTHORITY_SERVER,//授权中心地址
            client_id:process.env.REACT_APP_CLIENT_ID,//客户端IP
            response_type:process.env.REACT_APP_RESPONSE_TYPE,//返回值
            scope:process.env.REACT_APP_SCOPE,//API范围
            post_logout_redirect_uri:window.location.origin,//退出登录回调地址
            redirect_uri: window.location.origin+"/callback",//登录成功回调地址
            loadUserInfo:true,
            revokeAccessTokenOnSignout:true,
            automaticSilentRenew:true,
        })
    }
    /**
     * 授权中心
     */
    public async Login()
    {
        console.log({
            authority:process.env.APP_AUTHORITY_SERVER,//授权中心地址
            client_id:process.env.APP_CLIENT_ID,//客户端IP
            response_type:process.env.APP_RESPONSE_TYPE,//返回值
            scope:process.env.APP_SCOPE,//API范围
            post_logout_redirect_uri:window.location.origin,//退出登录回调地址
            redirect_uri: window.location.origin+"",//登录成功回调地址
            loadUserInfo:true,
            revokeAccessTokenOnSignout:true,
            automaticSilentRenew:true,
        })
        this.signinRedirect();
    }
    /**
     * 退出登录
     */
    public async outLogin()
    {
        this.signoutRedirect();
    }
}
const authorization =new ApplicationUserManager()
/**
 * 导出
 */
export {authorization as default};