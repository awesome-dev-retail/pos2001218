import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { history } from "../../components/MyRouter";

import CacheStorage from "../../lib/cache-storage";
import { formatNum, formatNumToTwoDecimal } from "../../services/formatNum";
import { Form, Input, Badge, Modal, Button } from "antd";
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

import { selectCurrentUser } from "../../slices/authSlice";

import {
  selectInvoice,
  selectDishObjInOrder,
  setDishObjInOrder,
  selectCashierStatus,
  setShowCashier,
  calculateInvoice,
  saveInvoice,
  listDocument,
  cancelInvoice,
  setInvoice,
  setCurrentDish,
  selectCurrentDish,
} from "../../slices/dishSlice";

import { selectDocument } from "../../slices/documentSlice";

import { fetchTableById, fetchTableListInShop, saveTable, endTable } from "../../slices/tableSlice";
import { selectTable } from "../../slices/tableSlice";

import { createInvoice } from "../../services/createInvoice";

import addIcon from "../../assets/images/jia.png";
import reduceIcon from "../../assets/images/jian.png";
import morentouxiang from "../../assets/images/morentouxiang.png";
import sousuo from "../../assets/images/sousuo.png";

import "./OrderList.scss";
import { message } from "../../lib";
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
  // const remarkList = ["Spicy", "Salted", "Vegetarian"];
  const [remarkList, setRemarkList] = useState(["Spicy", "No Sugar", "Vegetarian"]);
  const dispatch = useDispatch();
  // eslint-disable-next-line react/prop-types
  // const pathname = props.location.pathname + "";
  // const tableId = pathname.split("/")[3] * 1;

  // eslint-disable-next-line react/prop-types
  const tableId = props.match.params.tableId;

  const invoice = useSelector((state) => selectInvoice(state));

  const copyInvoice = JSON.parse(JSON.stringify(invoice));

  const currentUser = useSelector((state) => selectCurrentUser(state)) || {};

  const table = useSelector((state) => selectTable(state)) || {};

  const currentDish = useSelector((state) => selectCurrentDish(state));

  const cashierStatus = useSelector((state) => selectCashierStatus(state));

  const dishObjFromSlice = useSelector((state) => selectDishObjInOrder(state)) || [];

  const documentFromSlice = useSelector((state) => selectDocument(state));

  const { confirm } = Modal;

  const [form] = Form.useForm();

  const commentContainer = useRef();

  useEffect(async () => {
    // eslint-disable-next-line react/prop-types
    await dispatch(fetchTableById(tableId));

    if (Object.keys(invoice).length === 0) {
      const localInvoice = CacheStorage.getItem("invoice_" + "1_" + tableId);
      const newInvoice = localInvoice ? localInvoice : invoice;
      dispatch(setInvoice(newInvoice));
    }

    setCurrentDish({});
    // dispatch(clearCheckedDish());
  }, []);

  // useEffect(() => {}, [invoice, table]);

  const showPay = useMemo(() => {
    return Object.keys(invoice).length === 0 || !invoice.Lines || invoice.Lines.length === 0 ? false : true;
  }, [invoice]);

  const updateCount = async (value) => {
    if (currentDish) {
      let copyCurrentDish = JSON.parse(JSON.stringify(currentDish));
      copyCurrentDish.Quantity.Qty += value;
      // 数量为0  删除
      // if (!copyCurrentDish.Quantity.Qty) {
      //   dispatch(setCurrentDish({}));
      // } else {
      //   dispatch(setCurrentDish(copyCurrentDish));
      // }
      // let copyDishOrder = JSON.parse(JSON.stringify(dishObjFromSlice));
      let index = copyInvoice.Lines.findIndex((i) => {
        return i.Dish.DishCode === currentDish.Dish.DishCode;
      });
      if (!copyCurrentDish.Quantity.Qty) {
        copyInvoice.Lines.splice(index, 1);
      } else {
        copyInvoice.Lines[index].Quantity.Qty += value;
      }

      // const invoice = createInvoice(table, copyDishOrder, currentUser.userinfo.id);
      // dispatch(setDishObjInOrder(copyDishOrder));
      dispatch(calculateInvoice(invoice));
    }
  };

  const handleCheckDish = (dish) => {
    // const invoice = JSON.parse(JSON.stringify(invoice));
    // invoice.Lines.forEach((i) => {
    // i.checked = i.Dish.DishCode === dish.dish_code;
    // });
    dispatch(setCurrentDish(dish));
    // dispatch(setCurrentDish(dish));
    // await dispatch(setInvoice(invoice));
  };

  const handleOperation = async (key) => {
    if (key === "cancel") {
      confirm({
        title: "Are you sure to cancel the order?",
        icon: <ExclamationCircleOutlined />,
        // content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          dispatch(endTable(table.id));
          // await dispatch(fetchTableListInShop(1));
          // eslint-disable-next-line react/prop-types

          // CacheStorage.removeItem("dishObjInOrder_" + "1_" + table.id);
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
      return;
    }
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
      const invoice = createInvoice(table, copyDishOrder, currentUser.userinfo.id);
      dispatch(setDishObjInOrder(copyDishOrder));
      dispatch(calculateInvoice(invoice));
    } else if (key === "feeding") {
      if (currentDish && currentDish.extras && currentDish.extras.length !== 0) setShowDrawer(true);
    } else if (key === "remark") {
      setShowDrawer(true);
    }
  };

  const total = useMemo(() => {
    let count = 0,
      price = 0,
      oldPrice = 0;
    dishObjFromSlice.forEach((item) => {
      // let extrasAmount = 0;
      // if (item.extras && item.extras.length !== 0) {
      //   extrasAmount = item.extras.reduce((total, current) => (current.count ? total + current.count * current.unit_price : total), 0);
      // }
      // console.log("-------------item.extras", item.extras);
      count += item.count || 1;
      price += item.Amount;
      // price += extrasAmount;
      oldPrice += (item.count || 1) * item.unit_cost;
    });
    return { count, price: price.toFixed(2) };
  }, [JSON.stringify(dishObjFromSlice)]);

  let currentDishCopy = JSON.parse(JSON.stringify(currentDish));
  const handleCheckRemark = (item) => {
    // console.log(item);
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

  const handlePayment = () => {
    // let copyDishOrder = JSON.parse(JSON.stringify(dishObjFromSlice));
    // const invoice = createInvoice(table, copyDishOrder, currentUser.userinfo.id);
    dispatch(saveInvoice(table));
    // dispatch(setShowCashier(true));
  };

  const handleUpdateCount = (indexes, number) => {
    // let count = currentDishCopy.extras[indexes].count;
    if (!currentDishCopy.extras[indexes].count) {
      currentDishCopy.extras[indexes].count = 0;
    }
    currentDishCopy.extras[indexes].count += number;
    if (currentDishCopy.extras[indexes].count < 0) {
      currentDishCopy.extras[indexes].count = 0;
    }

    // currentDishCopy.material = materialData;
    dispatch(setCurrentDish(currentDishCopy));
    let copyDishObjFromSlice = JSON.parse(JSON.stringify(dishObjFromSlice));
    let index = copyDishObjFromSlice.findIndex((item) => item.id === currentDish.id);
    copyDishObjFromSlice.splice(index, 1, currentDishCopy);

    const invoice = createInvoice(table, copyDishObjFromSlice, currentUser.userinfo.id);
    dispatch(setDishObjInOrder(copyDishObjFromSlice));
    dispatch(calculateInvoice(invoice));
  };
  const handleAddComment = () => {
    // debugger;
    const newComment = commentContainer.current.input.value;
    const copyRemarkList = JSON.parse(JSON.stringify(remarkList || []));
    copyRemarkList.unshift(newComment);
    // commentContainer.current.input.value = "";
    setRemarkList(copyRemarkList);
  };
  const drawerDom = useMemo(() => {
    let dom = null;
    if (currentMeun === "feeding" && currentDish.extras && currentDish.extras.length !== 0) {
      dom = currentDish.extras.map((item, index) => (
        <div className="material-item" key={index}>
          <Badge count={item.count || 0}>
            <div className="material-info-inner">
              <div className="material-info-name">{item.inventory_id}</div>
              <span>${item.unit_price}</span>
            </div>
          </Badge>
          <div className="counter-inner">
            <div onClick={() => handleUpdateCount(index, -1)}>
              <img src={reduceIcon} alt="reduce" />
            </div>
            <div onClick={() => handleUpdateCount(index, 1)}>
              <img src={addIcon} alt="increase" />
            </div>
          </div>
        </div>
      ));
      // dom = (
      //   <div className="material-item">
      //     <Badge count={currentDish.material ? currentDish.material[0].count : 0}>
      //       <div className="material-info-inner">
      //         <div className="material-info-name">Milk</div>
      //         <span>$1</span>
      //       </div>
      //     </Badge>
      //     <div className="counter-inner">
      //       <div onClick={() => handleUpdateCount(-1)}>
      //         <img src={reduceIcon} alt="reduce" />
      //       </div>
      //       <div onClick={() => handleUpdateCount(1)}>
      //         <img src={addIcon} alt="increase" />
      //       </div>
      //     </div>
      //   </div>
      // );
    } else if (currentMeun === "remark") {
      dom = (
        <>
          <div className="tabs">
            {["For Dish"].map((item, index) => (
              <div className={currentTabIndex === index ? "active" : ""} key={item} onClick={() => setCurrentTabIndex(index)}>
                {item}
              </div>
            ))}
          </div>
          <div className="remark-list">
            {remarkList.map((item) => (
              <div onClick={() => handleCheckRemark(item)} className={`remark-item ${Array.isArray(currentDish.remark) && currentDish.remark.includes(item) ? "remark-item-active" : ""}`} key={item}>
                {item}
                {Array.isArray(currentDish.remark) && currentDish.remark.includes(item) && <CheckCircleTwoTone twoToneColor="$bizex-pink" />}
              </div>
            ))}
          </div>
          <div className="addComment" style={{ marginTop: 100 }}>
            <Form form={form}>
              <Form.Item label="" colon={false} name="name" rules={[{ required: false, message: "" }]}>
                <Input ref={commentContainer} placeholder="please input new comment" />
                <Button style={{ marginTop: 20 }} onClick={handleAddComment}>
                  Add Comment
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      );
    }
    return dom;
  }, [currentMeun, currentTabIndex, currentDish, remarkList]);

  // const handleCancelPayment = () => {
  //   dispatch(cancelInvoice(table));
  // };

  const handleCancelPayment = async () => {
    if (!table.uncomplete_invoices) {
      message.warning("No uncompleted invoice");
      return;
    } else {
      // debugger;
      if (table.uncomplete_invoices.length !== 0) {
        const params = { invoiceId: table.uncomplete_invoices[0].id, tableId: table.id };
        dispatch(cancelInvoice(params));
      }
    }
  };

  return (
    <div className="table-info-container">
      <div className="inner">
        <div className="table-info-inner">
          <div className="top-info">
            {/* <div className="top-info" onClick={() => setShowTableInfo(false)}> */}
            <span>
              Table Name: {table.table_name || ""}
              {/* Table Name: {table.table_name || ""}，2/{table.capacity} */}
            </span>
            {/* <span>桌台1，人数12/12</span> */}
            {/* <CaretDownOutlined /> */}
          </div>
          <div className="bill-list">
            {invoice.Lines &&
              invoice.Lines.map((item, index) => (
                <div
                  className={`bill-item ${
                    item.Dish && item.Dish.DishCode && currentDish.Dish && currentDish.Dish.DishCode && item.Dish.DishCode === currentDish.Dish.DishCode ? "bill-item-current" : ""
                  }`}
                  key={item.id}
                  onClick={() => handleCheckDish(item)}>
                  {/* <div> */}
                  <div className="bill-name">
                    <div>{item.Description}</div>
                    {/* {item.tip && <div className="food-tip">{item.tip}</div>} */}
                    {/* {item.extras && item.extras.length > 0 && item.material[0].count > 0 && ( */}
                    {item.ExtraDetail && item.ExtraDetail.ExtraList && item.ExtraDetail.ExtraList.length > 0 && (
                      <div className="materials">
                        {/* Extras: */}
                        {item.ExtraDetail.ExtraList.map((i, index) => (
                          <span key={index}>
                            {i.ExtraInventoryID} ${item.UnitExtraAmount}
                            {/* {i.ExtraInventoryID} x {i.ExtraQty} ${item.UnitExtraAmount} */}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.remark && item.remark.length > 0 && <div className="materials">Comments: {item.remark.join(",")}</div>}
                  </div>
                  {/* </div> */}
                  <div className="count">X {item.Quantity.Qty}</div>
                  {/* <div className="price">
                    <div className="new-price">${item.Amount}</div>
                    <div className="old-price">$ {item.unit_cost}</div> 
                  </div> */}
                  <div className="price">
                    <div className="new-price" style={{ fontWeight: "bolder" }}>
                      ${item.Amount}
                    </div>
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
              <div>
                <img src={morentouxiang} alt="morentouxiang" />0
              </div>
              <div>
                <div>
                  <img src={sousuo} alt="sousuo" />
                  Customer
                </div>
                <div className="tatal-top-right">
                  <div>N/A</div>POINTS
                </div>
              </div>
            </div>
            <div className="tatal-money-content">
              <div className="left">
                <div className="left-line">
                  <span className="label">DISCOUNT</span>
                  <span className="text">$0.00</span>
                  {/* <span className="text">${(total.oldPrice - total.price).toFixed(2)}</span> */}
                </div>
                <div className="left-line">
                  <span className="label">SUBTOTAL</span>
                  <span className="text">${(0.85 * total.price).toFixed(2)}</span>
                </div>
                <div className="left-line">
                  <span className="label">TAX(GST)</span>
                  <span className="text">${(0.15 * total.price).toFixed(2)}</span>
                </div>
              </div>
              <div className="content">
                <span>TOTAL</span>
                <div className="content-total">${total.price}</div>
              </div>
              {/* <div className="right">
                <div>NEW CUSTOMER</div>
                <div>ORDER DETAILS</div>
              </div> */}
            </div>
          </div>
          <div className="btn-group">
            <button
              onClick={() => {
                history.push("/");
              }}>
              BACK
            </button>
            {/* <button onClick={handleCancelPayment}>CANCEL PAYMENT</button> */}
            {/* <button>Add Dish</button> */}
            {!cashierStatus && (
              <button onClick={handlePayment} disabled={!showPay}>
                PAY
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="table-info-menus">
        <Counter count={(currentDish.Quantity && currentDish.Quantity.Qty) || 0} updateCount={updateCount} />
        {tableMenus.map((item) => (
          <div className="table-info-menu-item" key={item.key} onClick={() => handleOperation(item.key)}>
            {item.name}
          </div>
        ))}
        {/* <div className="table-info-menu-item" onClick={() => setShowMore(!showMore)}>
          <span>More</span>
          <div className={`table-info-childs-menu ${showMore ? "show" : "hide"}`}>
            <div>Share Table</div>
            <div>Change Table</div>
            <div>Combine Table</div>
          </div>
        </div> */}
      </div>
      {/* <div className={"drawer hide"}> */}
      <div className={`drawer ${showDrawer ? "show" : "hide"}`}>
        <div className="drawer-header">
          <h3 className="drawer-title">COMMENT</h3>
          {/* <h3 className="drawer-title">Comment-Fruit Salad</h3> */}
          <CloseOutlined onClick={() => setShowDrawer(false)} />
        </div>
        <div className="drawer-content">{drawerDom}</div>
      </div>
    </div>
  );
}

export default withRouter(OrderList);
