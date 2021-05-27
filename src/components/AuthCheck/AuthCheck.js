import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Logo from "../../assets/images/Bizex_FinalLogo.jpg";

import { Redirect, withRouter } from "react-router-dom";
import CONSTANT from "../../configs/CONSTANT";
import { useSelector, useDispatch } from "react-redux";
import CacheStorage from "../../lib/cache-storage";
import { MenuOutlined, PrinterOutlined, FileTextFilled, CaretDownOutlined, QuestionCircleFilled, AntDesignOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Avatar, Layout, Spin } from "antd";
import UIMenu from "../UIMenu";
import {
  fetchUser,
  setUser,
  setToken,
  selectIsLogin,
  selectCurrentUser,
  selectAuthIsLoading,
  fetchDevices,
  setShop, setLane
} from "../../slices/authSlice";
import { history } from "../MyRouter";

const AuthCheck = (props) => {
  const isLogin = useSelector((state) => selectIsLogin(state));
  const currentUser = useSelector((state) => selectCurrentUser(state));
  const isLoading = useSelector((state) => selectAuthIsLoading(state));
  const token = CacheStorage.getItem("token");
  const dispatch = useDispatch();
  const localShop = CacheStorage.getItem("SELECT_SHOP");
  const localLane = CacheStorage.getItem("SELECT_LANE");

  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      dispatch(fetchUser());

      if(localShop) {
        dispatch(setShop(localShop));
      }
      if(localLane) {
        dispatch(setLane(localLane));
      }

      dispatch(fetchDevices());

    } else {
      history.push("./login");
    }
  }, []);

  if (isLoading) {
    return (
      <div>
        <Spin className={styles.Spin} tip={"System Loading"} />
      </div>
    );
  }

  if (isLogin) {
    return (
      <Layout>
        <div className="home-page-container">
          <header className="header">
            <div>
              <MenuOutlined />
              Table
              <img style={{ width: 100, marginLeft: 100 }} src={Logo} alt="logo" />- BizCafe
            </div>
            <div style={{ fontSize: "14px", marginLeft: "800px" }}>{`Welcome! ${currentUser.userinfo.uname}`}</div>
            <div>
              <PrinterOutlined />
              <FileTextFilled />
              <QuestionCircleFilled />
              <Dropdown overlay={<UIMenu />} trigger={["click"]}>
                <Avatar size={40} icon={<AntDesignOutlined />}></Avatar>
              </Dropdown>
            </div>
          </header>
        </div>
        <div>
          <Spin spinning={isLoading}>{props.children}</Spin>
        </div>
      </Layout>
    );
  } else {
    return <Redirect to={CONSTANT.ROUTES.LOGIN} />;
  }

  return props.children;
};

export default withRouter(AuthCheck);
