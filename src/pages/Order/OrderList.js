import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import CacheStorage from "../../lib/cache-storage";

import { Badge, Modal, Button } from "antd";
import {
  MenuOutlined,
  PrinterOutlined,
  FileTextFilled,
  CaretDownOutlined,
  QuestionCircleFilled,
  CloseOutlined,
  CheckCircleTwoTone,
  AntDesignOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router";
import Counter from "../../components/Counter";

import { selectDishObjInOrder, setDishObjInOrder, setCurrentDish, selectCurrentDish, selectCashierStatus, setShowCashier } from "../../slices/dishSlice";
import { fetchTableById, fetchTableListInShop, saveTable } from "../../slices/tableSlice";
import { selectTable } from "../../slices/tableSlice";

import { calculateInvoice } from "../../slices/invoiceSlice";
import { selectInvoice } from "../../slices/invoiceSlice";
import { createInvoice } from "../../services/createInvoice";

import addIcon from "../../assets/images/jia.png";
import reduceIcon from "../../assets/images/jian.png";
import morentouxiang from "../../assets/images/morentouxiang.png";
import sousuo from "../../assets/images/sousuo.png";

import "./OrderList.scss";
function OrderList(props) {
  // const [currentDish, setCurrentDish] = useState({});
  const [currentMeun, setCurrentMeun] = useState();

  const [showMore, setShowMore] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const tableMenus = [
    // { name: "规格/做法", key: "spec" },
    { name: "Extras", key: "feeding" },
    { name: "Comment", key: "remark" },
    // { name: "稍后上菜", key: "wait" },
    // { name: "买赠", key: "buyGift" },
    { name: "Delete", key: "delete" },
    { name: "Cancel", key: "cancel" },
  ];
  const remarkList = ["Spicy", "Salted", "No nut", "Vegetarian"];
  // const remarkList = ["不加香菜", "不放辣", "不加葱花", "少盐", "素食"];
  const dispatch = useDispatch();
  // eslint-disable-next-line react/prop-types
  const tableId = props.match.params.id;
  // debugger;
  const table = useSelector((state) => selectTable(state)) || {};
  // console.log("=======================", table);
  const currentDish = useSelector((state) => selectCurrentDish(state));
  const cashierStatus = useSelector((state) => selectCashierStatus(state));
  const invoiceFromSlice = useSelector((state) => selectInvoice(state)) || {};

  const dishObjFromSlice = useSelector((state) => selectDishObjInOrder(state)) || [];

  const { confirm } = Modal;
  useEffect(async () => {
    // debugger;
    await dispatch(fetchTableById(tableId));
    console.log(tableId);
    dispatch(setDishObjInOrder([]));
    const arr = CacheStorage.getItem("dishObjInOrder_" + "1_" + tableId);
    // debugger;
    // console.log(arr);
    if (arr) {
      dispatch(setDishObjInOrder(arr));
      // debugger;
    }
    // return () => {
    //   console.log("-------------willUnmount");
    // };
  }, []);

  const updateCount = async (value) => {
    if (currentDish.id) {
      let copyCurrentDish = JSON.parse(JSON.stringify(currentDish));
      copyCurrentDish.count += value;
      // 数量为0  删除
      if (!copyCurrentDish.count) {
        // setCurrentDish({});
        dispatch(setCurrentDish({}));
      } else {
        // setCurrentDish(copyCurrentDish);
        dispatch(setCurrentDish(copyCurrentDish));
      }
      let copyDishOrder = JSON.parse(JSON.stringify(dishObjFromSlice));
      let index = copyDishOrder.findIndex((i) => {
        return i.id === currentDish.id;
      });
      if (!copyCurrentDish.count) {
        copyDishOrder.splice(index, 1);
      } else {
        copyDishOrder[index].count += value;
      }

      const invoice = createInvoice(table, copyDishOrder);
      console.log("invoice in updateCount----------------", invoice);
      await dispatch(calculateInvoice(invoice));
      CacheStorage.setItem("invoice_" + "1_" + table.id, invoiceFromSlice);
      //need adjust data from returned invoice here and modify arr later on.
      CacheStorage.setItem("dishObjInOrder_" + "1_" + table.id, copyDishOrder);
      await dispatch(setDishObjInOrder(copyDishOrder));
    }
  };

  const handleCheckDishOrder = async (item) => {
    let copyDishOrder = JSON.parse(JSON.stringify(dishObjFromSlice));
    copyDishOrder.forEach((i) => {
      i.checked = i.id === item.id;
    });
    // setCurrentDish(item);
    dispatch(setCurrentDish(item));

    await dispatch(setDishObjInOrder(copyDishOrder));
  };

  const handleOperation = async (key) => {
    if (!Object.keys(currentDish).length) {
      return;
    }
    setCurrentMeun(key); // 删除
    let copyDishOrder = JSON.parse(JSON.stringify(dishObjFromSlice));
    if (key === "delete") {
      let index = copyDishOrder.findIndex((i) => {
        return i.id === currentDish.id;
      });
      copyDishOrder.splice(index, 1);
      // setCurrentDish({});
      dispatch(setCurrentDish({}));
      // await dispatch(setDishObjInOrder(copyDishOrder));
      const invoice = createInvoice(table, copyDishOrder);
      console.log("invoice in handleOperation-delete----------------", invoice);
      await dispatch(calculateInvoice(invoice));
      CacheStorage.setItem("invoice_" + "1_" + table.id, invoiceFromSlice);
      //need adjust data from returned invoice here and modify arr later on.
      CacheStorage.setItem("dishObjInOrder_" + "1_" + table.id, copyDishOrder);
      await dispatch(setDishObjInOrder(copyDishOrder));
    } else if (key === "feeding") {
      setShowDrawer(true);
    } else if (key === "remark") {
      setShowDrawer(true);
    } else if (key === "cancel") {
      confirm({
        title: "Are you sure to cancel the order?",
        icon: <ExclamationCircleOutlined />,
        // content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        async onOk() {
          let tableObj = Object.assign({}, table);
          tableObj.status = "Available";
          await dispatch(saveTable(tableObj));
          // await dispatch(fetchTableListInShop(1));
          // eslint-disable-next-line react/prop-types
          props.history.push("/");
          // copyDishOrder = [];
          CacheStorage.removeItem("invoice_" + "1_" + table.id, invoiceFromSlice);
          //need adjust data from returned invoice here and modify arr later on.
          CacheStorage.removeItem("dishObjInOrder_" + "1_" + table.id, copyDishOrder);
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
    }
  };

  // 计算商品总数和总价
  const total = useMemo(() => {
    let count = 0,
      price = 0,
      oldPrice = 0;
    dishObjFromSlice.forEach((item) => {
      count += item.count || 1;
      price += (item.count || 1) * item.unit_price;
      oldPrice += (item.count || 1) * item.unit_cost;
    });
    return { count, price: price.toFixed(2), oldPrice: oldPrice.toFixed(2) };
  }, [JSON.stringify(dishObjFromSlice)]);

  let currentDishCopy = JSON.parse(JSON.stringify(currentDish));
  const handleCheckRemark = (item) => {
    console.log(item);
    if (currentDishCopy.remark) {
      let index = currentDishCopy.remark.findIndex((i) => item === i);
      let remark = currentDishCopy.remark;
      if (index > -1) {
        remark.splice(index, 1);
      } else {
        remark.push(item);
      }
      currentDishCopy = {
        ...currentDishCopy,
        remark,
      };
    } else {
      let remark = [item];
      currentDishCopy.remark = remark;
    }

    dispatch(setCurrentDish(currentDishCopy));
    let copyDishObjFromSlice = JSON.parse(JSON.stringify(dishObjFromSlice));
    let index = copyDishObjFromSlice.findIndex((item) => item.id === currentDish.id);
    copyDishObjFromSlice.splice(index, 1, currentDishCopy);
    dispatch(setDishObjInOrder(copyDishObjFromSlice));
  };

  const handleUpdateCashierStatus = () => {
    dispatch(setShowCashier(true));
  };
  /**
   *
   * @param {*} number
   */

  const hanndleUpdateCount = (number) => {
    let materialData = [];
    if (currentDishCopy.material && currentDishCopy.material.length) {
      materialData = currentDishCopy.material;
      let count = materialData[0].count + number;
      if (count >= 0) {
        materialData = [
          {
            name: "Milk",
            count,
            unitPrice: 1,
          },
        ];
        currentDishCopy = {
          ...currentDishCopy,
          material: materialData,
        };
      }
    } else if (number) {
      materialData[0] = {
        name: "Milk",
        count: number,
        unitPrice: 1,
      };
      currentDishCopy.material = materialData;
    }
    dispatch(setCurrentDish(currentDishCopy));
    let copyDishObjFromSlice = JSON.parse(JSON.stringify(dishObjFromSlice));
    let index = copyDishObjFromSlice.findIndex((item) => item.id === currentDish.id);
    copyDishObjFromSlice.splice(index, 1, currentDishCopy);
    dispatch(setDishObjInOrder(copyDishObjFromSlice));
  };
  const drawerDom = useMemo(() => {
    let dom = null;
    if (currentMeun === "feeding") {
      dom = (
        <div className="material-item">
          <Badge count={currentDish.material ? currentDish.material[0].count : 0}>
            <div className="material-info-inner">
              <div className="material-info-name">Milk</div>
              <span>$1</span>
            </div>
          </Badge>
          <div className="counter-inner">
            <div onClick={() => hanndleUpdateCount(-1)}>
              <img src={reduceIcon} alt="jian" />
            </div>
            <div onClick={() => hanndleUpdateCount(1)}>
              <img src={addIcon} alt="jia" />
            </div>
          </div>
        </div>
      );
    } else if (currentMeun === "remark") {
      dom = (
        <>
          <div className="tabs">
            {["For Dish", "For Order"].map((item, index) => (
              <div className={currentTabIndex === index ? "active" : ""} key={item} onClick={() => setCurrentTabIndex(index)}>
                {item}
              </div>
            ))}
          </div>
          <div className="remark-list">
            {remarkList.map((item) => (
              <div onClick={() => handleCheckRemark(item)} className={`remark-item ${Array.isArray(currentDish.remark) && currentDish.remark.includes(item) ? "remark-item-active" : ""}`} key={item}>
                {item}
                {Array.isArray(currentDish.remark) && currentDish.remark.includes(item) && <CheckCircleTwoTone twoToneColor="#ea7e52" />}
              </div>
            ))}
          </div>
        </>
      );
    }
    return dom;
  }, [currentMeun, currentTabIndex, currentDish]);
  return (
    <div className="table-info-container">
      <div className="inner">
        <div className="table-info-inner">
          <div className="top-info">
            {/* <div className="top-info" onClick={() => setShowTableInfo(false)}> */}
            <span>
              Table Name: {table.table_name || ""}，2/{table.capacity}
            </span>
            {/* <span>桌台1，人数12/12</span> */}
            <CaretDownOutlined />
          </div>
          <div className="bill-list">
            {dishObjFromSlice.map((item, index) => (
              <div className={`bill-item ${item.checked ? "bill-item-current" : ""}`} key={item.id} onClick={() => handleCheckDishOrder(item)}>
                <div>
                  <div className="bill-name">
                    <div>{item.description}</div>
                    {item.tip && <div className="food-tip">{item.tip}</div>}
                  </div>
                  {item.material && item.material.length > 0 && item.material[0].count > 0 && (
                    <div className="materials">
                      Extras:
                      {item.material.map((i, index) => (
                        <span key={index}>
                          {i.name} x {i.count} ${i.count * i.unitPrice}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.remark && item.remark.length > 0 && <div className="materials">Comments: {item.remark.join(",")}</div>}
                </div>
                <div className="count">X {item.count}</div>
                <div className="price">
                  <div className="new-price">${item.unit_price}</div>
                  <div className="old-price">$ {item.unit_cost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="table-bottom">
          {/* <div className="tatal-money-container">
            <span>Total: {total.count} dishes</span>&emsp;
            <div className="tatal-money">
              <span>${total.price}</span>
              <div className="old-price">Price: ${total.oldPrice}</div>
            </div>
          </div> */}
          <div className="tatal-money-container">
            <div className="tatal-money-top">
              <div><img src={morentouxiang} alt="morentouxiang" />0</div>
              <div><div><img src={sousuo} alt="sousuo" />Customer</div><div className="tatal-top-right"><div>N/A</div>POINTS</div></div>
            </div>
            <div className="tatal-money-content">
              <div className="left">
                <div className="left-line">
                  <span className="label">DISCOUNT</span>
                  <span className="text">${(total.oldPrice - total.price).toFixed(2)}</span>
                </div>
                <div className="left-line">
                  <span className="label">SUBTOTAL</span>
                  <span className="text">$32.0</span>
                </div>
                <div className="left-line">
                  <span className="label">TAX(GST)</span>
                  <span className="text">${0.15 * total.price}</span>
                </div>
              </div>
              <div className="content">
                <span>TOTAL</span>
                <div className="content-total">${total.price}</div>
              </div>
              <div className="right">
                <div>NEW CUSTOMER</div>
                <div>ORDER DETAILS</div>
              </div>
            </div>
          </div>
          <div className="btn-group">
            <div>Add Dish</div>
            {!cashierStatus && <div onClick={handleUpdateCashierStatus}>Checkout</div>}
          </div>
        </div>
      </div>
      <div className="table-info-menus">
        <Counter count={currentDish.count || 0} updateCount={updateCount} />
        {tableMenus.map((item) => (
          <div className="table-info-menu-item" key={item.key} onClick={() => handleOperation(item.key)}>
            {item.name}
          </div>
        ))}
        <div className="table-info-menu-item" onClick={() => setShowMore(!showMore)}>
          <span>More</span>
          <div className={`table-info-childs-menu ${showMore ? "show" : "hide"}`}>
            <div>Share Table</div>
            <div>Change Table</div>
            <div>Combine Table</div>
            <div>Batch</div>
          </div>
        </div>
      </div>
      {/* <div className={"drawer hide"}> */}
      <div className={`drawer ${showDrawer ? "show" : "hide"}`}>
        <div className="drawer-header">
          <h3 className="drawer-title">Comment-Fruit Salad</h3>
          <CloseOutlined onClick={() => setShowDrawer(false)} />
        </div>
        <div className="drawer-content">{drawerDom}</div>
      </div>
    </div>
  );
}

export default withRouter(OrderList);
