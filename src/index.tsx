import './index.css';
import "antd/dist/antd.less";

import React from 'react';
import ReactDOM from 'react-dom';
import Router from "@/router/index"

import { USER_MENU } from "@/store/actionType";
 import store from "@/store"

 const token = localStorage.getItem("token");

if (!!token) {
  localStorage.setItem("token", "13213213");
  store.dispatch({
    type: USER_MENU,
    data: require("@/domain/menu-domain/mock/menumock").menuList
  });
}

ReactDOM.render(
  // <React.StrictMode>//严格模式是否开启
    <Router />,
  // </React.StrictMode>,
  document.getElementById('root')
);
