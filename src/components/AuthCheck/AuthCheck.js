import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import logoAbbey from "../../assets/images/logo-Abbey.png";

import { Redirect, withRouter } from "react-router-dom";
import CONSTANT from "../../configs/CONSTANT";
import { useSelector, useDispatch, useStore } from "react-redux";
import CacheStorage from "../../lib/cache-storage";
import { MenuOutlined, PrinterOutlined, FileTextFilled, CaretDownOutlined, QuestionCircleFilled, AntDesignOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Avatar, Layout, Spin } from "antd";
import UIMenu from "../UIMenu";
import { fetchUser, setUser, setToken, selectIsLogin, selectCurrentUser, selectAuthIsLoading, fetchDevices, setShop, setLane, selectLane, selectShop, setDevice } from "../../slices/authSlice";
import { history } from "../MyRouter";
import { connectSocket, setDocument } from "../../slices/documentSlice";
import _ from "lodash";
import TopNavBar from "../TopNavBar";

const AuthCheck = (props) => {
  const isLogin = useSelector((state) => selectIsLogin(state));
  const currentUser = useSelector((state) => selectCurrentUser(state));
  const isLoading = useSelector((state) => selectAuthIsLoading(state));
  const token = CacheStorage.getItem("token");
  const dispatch = useDispatch();
  const localShop = CacheStorage.getItem("SELECT_SHOP");
  const localLane = CacheStorage.getItem("SELECT_LANE");

  const localDocument = CacheStorage.getItem(CONSTANT.LOCALSTORAGE_SYMBOL.DOCUMENT_SYMBOL);
  const shop = useSelector((state) => selectShop(state));
  const lane = useSelector((state) => selectLane(state));
  const store = useStore();

  const checkAuth = async () => {
    if (token) {
      dispatch(setToken(token));
      dispatch(fetchUser());

      if (localShop) {
        dispatch(setShop(localShop));
      }
      if (localLane) {
        dispatch(setLane(localLane));
      }

      await dispatch(fetchDevices());

      if (localDocument) {
        const { id } = localDocument;
        const { location } = props;
        const url = `/payment/${id}`;
        if (location.pathname !== url) {
          history.push(url);
        }
      }
    } else {
      history.push("./login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);



  if (isLoading) {
    return (
      <div>
        <Spin className={styles.Spin} tip={"System Loading"} />
      </div>
    );
  }

  if (isLogin && !_.isEmpty(shop) && !_.isEmpty(lane)) {
    return (
      <Layout>
        <div className="home-page-container">
         <TopNavBar />
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
