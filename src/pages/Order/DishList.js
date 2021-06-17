/* eslint-disable react/prop-types */
import React, { Fragment, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Badge, Modal, Button } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import CacheStorage from "../../lib/cache-storage";

import { selectCurrentUser } from "../../slices/authSlice";

import { fetchDishListInShop, fetchDishListInMenu, deleteDish, setDishObjInOrder, selectDishObjInOrder, calculateInvoice, setCurrentLine } from "../../slices/dishSlice";
import { selectInvoice } from "../../slices/dishSlice";

import { selectTable } from "../../slices/tableSlice";

import { selectDishList } from "../../slices/dishSlice";

import { selectMenuId } from "../../slices/menuSlice";

import AddDish from "../../components/AddDish";

import { createInvoice, createLine } from "../../services/createInvoice";

function DishList(props) {
  const [showDish, setShowDish] = useState(false);
  const [dishId, setDishId] = useState(0);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [isAdmin, setIsAdmin] = useState(true);

  const { confirm } = Modal;

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => selectCurrentUser(state)) || {};
  const dishListFromSlice = useSelector((state) => selectDishList(state)) || [];
  const dishObjInOrder = useSelector((state) => selectDishObjInOrder(state)) || [];

  const menuIdFromSlice = useSelector((state) => selectMenuId(state));

  const table = useSelector((state) => selectTable(state)) || {};
  const invoice = useSelector((state) => selectInvoice(state));

  useEffect(() => {
    dispatch(fetchDishListInShop(1));
  }, []);

  const getClass = (type) => {
    return type === "eating" ? "eating" : type === "waitPlanOrder" ? "wait-plan-order" : "empty";
  };

  // const redirectToOrder = () => {
  //   // eslint-disable-next-line react/prop-types
  //   props.history.push("/order");
  // };

  const handleSaveDish = (dishId, description, price) => {
    setShowDish(true);
    setDishId(dishId);
    setDescription(description);
    setPrice(price);
  };

  function showDeleteConfirm(dish) {
    confirm({
      title: "Are you sure to delete this item?",
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await dispatch(deleteDish(dish.id));
        // await dispatch(fetchDishListInShop(1));
        await dispatch(fetchDishListInMenu(dish.class_id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  const addToOrderList = async (dish) => {
    let newInvoice = {};
    if (Object.keys(invoice).length === 0) {
      newInvoice = createInvoice(table, dish, currentUser.userinfo.id);
      dispatch(setCurrentLine(newInvoice.Lines[0]));
    } else {
      newInvoice = JSON.parse(JSON.stringify(invoice || {}));
      if (newInvoice.Lines && newInvoice.Lines.length !== 0) {
        let index = newInvoice.Lines.findIndex((item) => item.Dish.DishCode === dish.dish_code);
        // let copyDish = JSON.parse(JSON.stringify(dish));
        if (index > -1) {
          newInvoice.Lines[index].Quantity.Qty += 1;
          dispatch(setCurrentLine(newInvoice.Lines[index]));
        } else {
          const line = createLine(dish);
          newInvoice.Lines.push(line);
          dispatch(setCurrentLine(line));
        }
      } else {
        newInvoice.Lines = [];
        const line = createLine(dish);
        newInvoice.Lines.push(line);
        dispatch(setCurrentLine(line));
      }
    }
    dispatch(calculateInvoice(newInvoice));
    // dispatch(setCurrentLine(dish));
    return;
  };
  return (
    <Fragment>
      <div className="table-list">
        {dishListFromSlice.map((item) => (
          <div key={item.id} className={`table-item ${getClass(item.status)}`}>
            {/* <div key={item.id} className={`dish-item ${getClass(item.status)}`} onClick={() => setShowDishInfo(true)}> */}
            <div
              onClick={() => {
                addToOrderList(item);
              }}>
              <p className="table-id">{item.description}</p>
              {item.unit_price && <div className="money">${item.unit_price.toFixed(2)}</div>}
              {/* {item.combination && <div>Share {item.combination} Dishs</div>} */}
              {/* {item.status === "waitPlanOrder" && <div className="wait-plan-order-text">To be ordered</div>}
              <div>
                {item.tag} {item.time && <span>{item.time}</span>}
              </div> */}
            </div>
            <div className="edit-delete">
              {isAdmin && <EditOutlined onClick={(event) => handleSaveDish(item.id, item.description, item.unit_price)} />}
              {isAdmin && <DeleteOutlined onClick={() => showDeleteConfirm(item)} />}
            </div>
          </div>
        ))}
        <div className="table-item add-table" onClick={() => handleSaveDish()}>
          <PlusOutlined />
          <div>Add Dish</div>
        </div>
      </div>
      <AddDish visible={showDish} hideModel={setShowDish} id={dishId} description={description} price={price}></AddDish>
    </Fragment>
  );
}

export default withRouter(DishList);
