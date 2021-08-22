import Callback from "@/pages/callback-page/callback-page";
import { Guid } from "guid-typescript";
import { IMenuRoute } from "@/domain/menu-domain/menu-entities/imenurouter";
import LoginView from "@/pages/login/login";

const login: IMenuRoute[] = [
    {
      id: Guid.create().toString(),
      name: "login",
      path: '/login',
      component: LoginView,
      isShow: false,
      children: [],
    },
    {
      id:Guid.create().toString(),
      name: "callback",
      path: '/callback',
      component: Callback,
      isShow: false,
      children: [],
    }
  ];
  export default login;