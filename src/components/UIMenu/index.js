import React from "react";
import { Menu } from "antd";
import CacheStorage from "../../lib/cache-storage";
import CONSTANT from "../../configs/CONSTANT";
import { useHistory } from "react-router-dom";
import { fetchUser, userLogOut } from "../../slices/authSlice";
import { useDispatch } from "react-redux";

const UIMenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const logout = async (e) => {
    await dispatch(userLogOut());
    // history.push(CONSTANT.ROUTES.LOGIN);
  };

  return (
    <Menu>
      <Menu.Item key="0">
        <div onClick={logout}>Logout</div>
      </Menu.Item>
      <Menu.Item key="1">Setting</Menu.Item>
      <Menu.Item key="3">Personal Info</Menu.Item>
    </Menu>
  );
};

export default UIMenu;
