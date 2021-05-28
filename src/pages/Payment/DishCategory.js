import React, { Fragment, useState, useEffect } from "react";
import { Badge, Modal, Button } from "antd";

import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import { fetchMenuList, deleteMenu } from "../../slices/menuSlice";
import { selectMenuList, setMenuIdInSlice } from "../../slices/menuSlice";

import { fetchDishListInMenu, fetchDishListInShop, deleteDish } from "../../slices/dishSlice";
import { selectDishList } from "../../slices/dishSlice";

import AddMenu from "../../components/AddMenu";

export default function MenuList() {
  const [showMenu, setShowMenu] = useState(false);
  const [menuId, setMenuId] = useState(0);
  const [menuName, setMenuName] = useState("");

  const [isAdmin, setIsAdmin] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  // let modalForm = null;

  const { confirm } = Modal;

  const dispatch = useDispatch();
  const menuListFromSlice = useSelector((state) => selectMenuList(state)) || [];

  // const menuIdFromSlice = useSelector((state) => selectMenuId(state));

  const dishListFromSlice = useSelector((state) => selectDishList(state)) || [];
  // console.log("menuListFromSlice", menuListFromSlice);

  useEffect(async () => {
    await dispatch(fetchMenuList(1));
  }, []);

  const showDishesInMenu = (menuId) => {
    dispatch(setMenuIdInSlice(menuId));
    dispatch(fetchDishListInMenu(menuId));
  };

  function showDeleteConfirm(id) {
    confirm({
      title: "Are you sure to delete this item?",
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        // console.log("OK");
        // console.log(id);
        await dispatch(deleteMenu(id));
        await dispatch(fetchMenuList(1));
        dishListFromSlice.forEach((item) => dispatch(deleteDish(item.id)));
        await dispatch(fetchDishListInShop(1));
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  }

  const showDishesInShop = () => {
    dispatch(fetchDishListInShop(1));
  };

  const handleSaveMenu = (isUpdate, menuId, menuName) => {
    setShowMenu(!showMenu);
    if (isUpdate) {
      setMenuId(menuId);
      setMenuName(menuName);
      setIsUpdate(true);
    } else {
      setMenuId(null);
      setIsUpdate(false);
    }
  };
  return (
    <Fragment>
      <div className="menu-list">
        <div className="menu-item">
          {/* <Badge size="small" count={5} offset={[5]}> */}
          <div onClick={showDishesInShop}>All Menus</div>
          {/* </Badge> */}
        </div>
        {menuListFromSlice.map((item) => {
          return (
            <div
              key={item.id}
              className="menu-item"
              onClick={() => {
                showDishesInMenu(item.id);
              }}>
              {/* <Badge size="small" count={5} offset={[5]}> */}
              <div>{item.class_name}</div>
              {isAdmin && <EditOutlined onClick={() => handleSaveMenu(true, item.id, item.class_name)} />}
              {isAdmin && <DeleteOutlined onClick={() => showDeleteConfirm(item.id)} />}
              {/* {isAdmin && <DeleteOutlined onClick={() => setShowDeleteModal(!ShowDeleteModal)} />} */}
              {/* </Badge> */}
            </div>
          );
        })}
        <div className="menu-item" onClick={() => handleSaveMenu(false)}>
          <PlusOutlined />
          Add
        </div>
      </div>
      <AddMenu visible={showMenu} hideModel={setShowMenu} id={menuId} name={menuName} />
    </Fragment>
  );
}
