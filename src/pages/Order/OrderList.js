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
  setCurrentLine,
  selectCurrentLine,
  selectDishList,
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
  // const [currentLine, setCurrentLine] = useState({});
  const [currentMeun, setCurrentMeun] = useState();
  const [currentDish, setCurrentDish] = useState();

  const [showMore, setShowMore] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const tableMenus = [
    // { name: "规格/做法", key: "spec" },
    { name: "Extras", key: "extras" },
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

  const currentLine = useSelector((state) => selectCurrentLine(state));

  const cashierStatus = useSelector((state) => selectCashierStatus(state));

  const dishObjFromSlice = useSelector((state) => selectDishObjInOrder(state)) || [];

  const dishListInShop = useSelector((state) => selectDishList(state));

  const documentFromSlice = useSelector((state) => selectDocument(state));

  const currentDishCopy = JSON.parse(JSON.stringify(currentDish || {}));
  const currentLineCopy = JSON.parse(JSON.stringify(currentLine || {}));

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

    dispatch(setCurrentLine({}));
    // dispatch(clearCheckedDish());
  }, []);

  // useEffect(() => {}, [invoice, table]);

  const showPay = useMemo(() => {
    return Object.keys(invoice).length === 0 || !invoice.Lines || invoice.Lines.length === 0 ? false : true;
  }, [invoice]);

  const updateCount = (value) => {
    if (Object.keys(currentLine).length !== 0) {
      let index = copyInvoice.Lines.findIndex((i) => {
        return i.Dish.DishCode === currentLine.Dish.DishCode;
      });
      copyInvoice.Lines[index].Quantity.Qty += value;
      if (!copyInvoice.Lines[index].Quantity.Qty) {
        copyInvoice.Lines.splice(index, 1);
        dispatch(setCurrentLine({}));
        setShowDrawer(false);
      } else {
        copyInvoice.Lines[index].Quantity.Changed = true;
        dispatch(setCurrentLine(copyInvoice.Lines[index]));
      }
      dispatch(calculateInvoice(copyInvoice));
    }
  };

  const handleCheckLine = (line) => {
    setShowDrawer(false);
    dispatch(setCurrentLine(line));
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
    if (!Object.keys(currentLine).length) {
      return;
    }
    setCurrentMeun(key);
    if (key === "delete") {
      if (Object.keys(currentLine).length !== 0) {
        let index = copyInvoice.Lines.findIndex((i) => {
          return i.Dish.DishCode === currentLine.Dish.DishCode;
        });
        copyInvoice.Lines.splice(index, 1);
        dispatch(setCurrentLine({}));
        setShowDrawer(false);
        dispatch(calculateInvoice(copyInvoice));
      }
    } else if (key === "extras") {
      const dish = dishListInShop.find((i) => i.dish_code === currentLine.Dish.DishCode);
      if (dish) {
        setCurrentDish(dish);
      }
      if (dish && dish.extras && dish.extras.length !== 0) setShowDrawer(true);
    } else if (key === "remark") {
      setShowDrawer(true);
    }
  };

  // const total = useMemo(() => {
  //   let count = 0,
  //     price = 0,
  //     oldPrice = 0;
  //   dishObjFromSlice.forEach((item) => {
  //     // let extrasAmount = 0;
  //     // if (item.extras && item.extras.length !== 0) {
  //     //   extrasAmount = item.extras.reduce((total, current) => (current.count ? total + current.count * current.unit_price : total), 0);
  //     // }
  //     // console.log("-------------item.extras", item.extras);
  //     count += item.count || 1;
  //     price += item.Amount;
  //     // price += extrasAmount;
  //     oldPrice += (item.count || 1) * item.unit_cost;
  //   });
  //   return { count, price: price.toFixed(2) };
  // }, [JSON.stringify(dishObjFromSlice)]);

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

    dispatch(setCurrentLine(currentDishCopy));
    let copyDishObjFromSlice = JSON.parse(JSON.stringify(dishObjFromSlice));
    let index = copyDishObjFromSlice.findIndex((item) => item.id === currentLine.id);
    copyDishObjFromSlice.splice(index, 1, currentDishCopy);
    dispatch(setDishObjInOrder(copyDishObjFromSlice));
  };

  const handlePayment = () => {
    // let copyDishOrder = JSON.parse(JSON.stringify(dishObjFromSlice));
    // const invoice = createInvoice(table, copyDishOrder, currentUser.userinfo.id);
    dispatch(saveInvoice(table));
    // dispatch(setShowCashier(true));
  };

  const handleUpdateCount = (extraID, number) => {
    if (!currentLineCopy.ExtraDetail.ExtraList) {
      if (number === -1) {
        return;
      }
      currentLineCopy.ExtraDetail.ExtraList = [];
      currentLineCopy.ExtraDetail.Changed = true;
      currentLineCopy.ExtraDetail.ExtraList.push({
        ExtraID: extraID, // [required]
        ExtraQty: number, // [required]
      });
    } else {
      const index = currentLineCopy.ExtraDetail.ExtraList.findIndex((i) => i.ExtraID === extraID);
      if (index > -1) {
        currentLineCopy.ExtraDetail.ExtraList[index].ExtraQty += number;
        if (currentLineCopy.ExtraDetail.ExtraList[index].ExtraQty === 0) {
          currentLineCopy.ExtraDetail.ExtraList.splice(index, 1);
          if (currentLineCopy.ExtraDetail.ExtraList.length === 0) {
            currentLineCopy.ExtraDetail.ExtraList = null;
          }
        }
        currentLineCopy.ExtraDetail.Changed = true;
      } else {
        currentLineCopy.ExtraDetail.ExtraList.push({
          ExtraID: extraID, // [required]
          ExtraQty: number, // [required]
        });
        currentLineCopy.ExtraDetail.Changed = true;
      }
    }
    currentLineCopy.Changed = true;
    // currentLineCopy.Dish.Changed = true;
    dispatch(setCurrentLine(currentLineCopy));
    const index = copyInvoice.Lines.findIndex((i) => i.Dish.DishCode === currentLineCopy.Dish.DishCode);
    copyInvoice.Lines.splice(index, 1, currentLineCopy);
    dispatch(calculateInvoice(copyInvoice));
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
    if (currentMeun === "extras" && currentDish.extras.length !== 0) {
      dom = currentDish.extras.map((item, index) => {
        const extra = currentLine.ExtraDetail && currentLine.ExtraDetail.ExtraList && currentLine.ExtraDetail.ExtraList.find((i) => i.ExtraID === item.id);
        return (
          <div className="material-item" key={index}>
            <Badge count={extra ? extra.ExtraQty : 0}>
              <div className="material-info-inner">
                <div className="material-info-name">{item.inventory_id}</div>
                <span>${item.unit_price}</span>
              </div>
            </Badge>
            <div className="counter-inner">
              <div onClick={() => handleUpdateCount(item.id, -1)}>
                <img src={reduceIcon} alt="reduce" />
              </div>
              <div onClick={() => handleUpdateCount(item.id, 1)}>
                <img src={addIcon} alt="increase" />
              </div>
            </div>
          </div>
        );
      });
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
              <div onClick={() => handleCheckRemark(item)} className={`remark-item ${Array.isArray(currentLine.remark) && currentLine.remark.includes(item) ? "remark-item-active" : ""}`} key={item}>
                {item}
                {Array.isArray(currentLine.remark) && currentLine.remark.includes(item) && <CheckCircleTwoTone twoToneColor="$bizex-pink" />}
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
  }, [currentMeun, currentTabIndex, currentLine, invoice, currentDish, remarkList]);

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
                    item.Dish && item.Dish.DishCode && currentLine.Dish && currentLine.Dish.DishCode && item.Dish.DishCode === currentLine.Dish.DishCode ? "bill-item-current" : ""
                  }`}
                  key={item.id}
                  onClick={() => handleCheckLine(item)}>
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
                  <div className="count">${item.UnitPrice.toFixed(2)}</div>
                  <div className="count">X {item.Quantity.Qty}</div>
                  {/* <div className="price">
                    <div className="new-price">${item.Amount}</div>
                    <div className="old-price">$ {item.unit_cost}</div> 
                  </div> */}
                  <div className="price">
                    <div className="new-price" style={{ fontWeight: "bolder" }}>
                      ${item.Amount.toFixed(2)}
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
                  <span className="text">${(invoice.NetAmount && invoice.NetAmount.toFixed(2)) || "0.00"}</span>
                </div>
                <div className="left-line">
                  <span className="label">TAX(GST)</span>
                  <span className="text">${(invoice.GSTAmount && invoice.GSTAmount.toFixed(2)) || "0.00"}</span>
                </div>
              </div>
              <div className="content">
                <span>TOTAL</span>
                <div className="content-total">${(invoice.GrossAmount && invoice.GrossAmount.toFixed(2)) || "0.00"}</div>
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
        <Counter count={(currentLine.Quantity && currentLine.Quantity.Qty) || 0} updateCount={updateCount} />
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
