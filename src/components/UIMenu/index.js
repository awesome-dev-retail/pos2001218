import React from "react";
import { Menu } from "antd";

const UIMenu = () => {
  return (
    <Menu>
      <Menu.Item key="0">
        <a href="https://www.antgroup.com">Logout</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="https://www.aliyun.com">Settings</a>
      </Menu.Item>
      <Menu.Item key="3">Personal</Menu.Item>
    </Menu>
  );
};

export default UIMenu;
