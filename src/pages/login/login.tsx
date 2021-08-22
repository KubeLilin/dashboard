// import ApplicationUserManager from '@/shared/ids4/identityServerLogin';

import ApplicationUserManager from "@/shard/ids4-oidc-login/IdentityServerLogin"
import {useEffect} from 'react'

const Login = (props:{history:any}) => {
  useEffect(() => {
    localStorage.setItem("token", "user.access_token");
    // ApplicationUserManager.Login()
    props.history.push("/home");
  },[props])
  return (
    <div>
      登录dadas页面
    </div>
  )
}

export default Login

// class Login extends React.Component<{ history: any }> {
//   componentWillMount() {
//     // ApplicationUserManager.Login();
//     console.log(123456)
//     localStorage.setItem("token","1234566");
//     this.props.history.push("/home");
//       this.setState({
//         loading: false
//       })
//       this.props.history.go();
//   }
//   render() {
//     return (
//       <div></div>
//     )
//   }
// }
// export default Login;