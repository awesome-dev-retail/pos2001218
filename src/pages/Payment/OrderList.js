import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { history } from "../../components/MyRouter";

import CacheStorage from "../../lib/cache-storage";
import { formatNum, formatNumToTwoDecimal } from "../../services/formatNum";
import { Badge, Modal, Button, Checkbox } from "antd";
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
import { fetchDocument, selectShowSplitOrder, selectBillList, setBillList } from "../../slices/documentSlice";
import { setAmountPaying, setAmountPaid, selectAmountPaidArr } from "../../slices/paymentSlice";

import {
  selectDishObjInOrder,
  setDishObjInOrder,
  setCurrentDish,
  selectCurrentDish,
  clearCheckedDish,
  selectCashierStatus,
  setShowCashier,
  calculateInvoice,
  saveInvoice,
  listDocument,
  cancelInvoice,
  setCurrentInvoice,
} from "../../slices/dishSlice";
import { selectInvoice } from "../../slices/dishSlice";

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
  const [orderTabIndex, setOrderTabIndex] = useState(0);
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
  const currentUser = useSelector((state) => selectCurrentUser(state)) || {};
  const table = useSelector((state) => selectTable(state)) || {};
  // console.log("=======================", table);
  const currentDish = useSelector((state) => selectCurrentDish(state));
  const cashierStatus = useSelector((state) => selectCashierStatus(state));

  const dishObjFromSlice = useSelector((state) => selectDishObjInOrder(state)) || [];

  const documentFromSlice = useSelector((state) => selectDocument(state)) || {};
  const billList = useSelector((state) => selectBillList(state)) || [];

  const showSplitOrder = useSelector((state) => selectShowSplitOrder(state));

  const amountPaidArr = useSelector((state) => selectAmountPaidArr(state));

  const { confirm } = Modal;
  useEffect(async () => {
    // console.log(history);
    // eslint-disable-next-line react/prop-types
    const invoiceId = props.match.params.invoiceId;
    // dispatch(fetchDocument(invoiceId));
    dispatch(setCurrentDish({}));
    dispatch(clearCheckedDish());
  }, []);

  const handleCheckDishOrder = async (item) => {
    let copyDishOrder = JSON.parse(JSON.stringify(dishObjFromSlice));
    copyDishOrder.forEach((i) => {
      i.checked = i.id === item.id;
    });
    // setCurrentDish(item);
    dispatch(setCurrentDish(item));
    await dispatch(setDishObjInOrder(copyDishOrder));
  };

  // for cash
  const total = useMemo(() => {
    // let count = 0,
    //   price = 0,
    //   oldPrice = 0;

    // billList.forEach((item) => {
    //   count += item.line_qty || 1;
    //   price += (item.line_qty || 1) * item.unit_price;
    //   oldPrice += (item.count || 1) * item.unit_cost;
    // });
    let gross = documentFromSlice.doc_gross_amount ? documentFromSlice.doc_gross_amount.toFixed(2) : "0.00";
    let gst = documentFromSlice.doc_GST_amount ? documentFromSlice.doc_GST_amount.toFixed(2) : "0.00";
    let net = documentFromSlice.doc_net_amount ? documentFromSlice.doc_net_amount.toFixed(2) : "0.00";
    return { gross, gst, net };
  }, [JSON.stringify(documentFromSlice)]);

  //for split
  const result = useMemo(() => {
    let amountPaying = 0;
    let remainingDue = 0;
    let amountPaid = 0;
    let total = 0;

    total = documentFromSlice.doc_gross_amount;

    billList.forEach((item) => {
      if (item.checked) {
        amountPaying += item.line_amount;
      }
    });

    amountPaid = amountPaidArr.reduce((total, current) => total + current, 0);

    remainingDue = documentFromSlice.doc_gross_amount - amountPaid;
    // console.log(amountPaidArr);
    dispatch(setAmountPaying(amountPaying));
    dispatch(setAmountPaid(amountPaid));
    return { amountPaying, remainingDue, amountPaid, total };
  }, [documentFromSlice, billList, amountPaidArr]);

  const handleSetTab = (index) => {
    setOrderTabIndex(index);
  };

  const handleChangeBox = (e, index) => {
    // let copyDishObjFromSlice = JSON.parse(JSON.stringify(dishObjFromSlice));
    const copybillList = JSON.parse(JSON.stringify(billList));
    let { checked } = e.target;
    copybillList[index].checked = checked;
    dispatch(setBillList(copybillList));
  };

  const getCheckDishObjInOrderPrice = useMemo(() => {
    let price = 0;
    dishObjFromSlice.forEach((item) => {
      if (item.checked) {
        price += (item.count || 1) * item.unit_price;
      }
    });
    return price;
  }, [dishObjFromSlice]);

  const handleCancelPayment = async () => {
    // if (!table.uncomplete_invoices) {
    //   message.warning("No uncompleted invoice");
    //   return;
    // } else {
    //   if (table.uncomplete_invoices.length !== 0) dispatch(cancelInvoice(table.uncomplete_invoices[0].id));
    // }
    const params = { invoiceId: documentFromSlice.id, tableId: documentFromSlice.table_id };
    dispatch(cancelInvoice(params));
  };

  return (
    <div className="table-info-container">
      <div className="inner">
        <div className="table-info-inner">
          {showSplitOrder && (
            <div className="order-tabs">
              {["Items", "Portion"].map((item, index) => (
                <div key={item} className={index === orderTabIndex ? "current-order-tab" : ""} onClick={() => handleSetTab(index)}>
                  {item}
                </div>
              ))}
            </div>
          )}
          {showSplitOrder &&
            amountPaidArr.map((item, index) => (
              <div key={item} className="paid-line">
                <span>Payment {index + 1} - Cash</span>
                <span>${item.toFixed(2)}</span>
              </div>
            ))}
          <div className="bill-list">
            {billList.map((item, index) => (
              <div className={`bill-item ${item.checked ? "bill-item-current" : ""}`} key={item.id} onClick={() => handleCheckDishOrder(item)}>
                {showSplitOrder && <Checkbox className="check-box" onChange={(e) => handleChangeBox(e, index)}></Checkbox>}
                <div className="bill-name">
                  <div>{item.description}</div>
                  {/* {item.tip && <div className="food-tip">{item.tip}</div>}
                  {item.material && item.material.length > 0 && item.material[0].count > 0 && (
                    <div className="materials">
                      Extras:
                      {item.dish_extra.map((i, index) => (
                        <span key={index}>
                          {i.ExtraInventoryID} x {i.ExtraQty} ${i.ExtraQty * i.unit_extra_amount}
                        </span>
                      ))}
                    </div>
                  )}  
                  {item.remark && item.remark.length > 0 && <div className="materials">Comments: {item.remark.join(",")}</div>} */}
                </div>
                <div className="count">X {item.line_qty}</div>
                <div className="price">
                  <div className="new-price">${item.line_amount.toFixed(2)}</div>
                  {/* <div className="old-price">$ {item.unit_cost}</div>  */}
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
          {!showSplitOrder ? (
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
                    <span className="text">${total.net}</span>
                  </div>
                  <div className="left-line">
                    <span className="label">TAX(GST)</span>
                    <span className="text">${total.gst}</span>
                  </div>
                </div>
                <div className="content">
                  <span>TOTAL</span>
                  <div className="content-total">${total.gross}</div>
                </div>
                <div className="right">
                  <div>NEW CUSTOMER</div>
                  <div>ORDER DETAILS</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="tatal-money-container-split">
              <div>
                <span>Total:</span>
                <div className="total-money">${result.total.toFixed(2)}</div>
              </div>
              <div>
                <div>
                  <span className="amount">Amount paying:</span>
                  <span className="total-money-right">${result.amountPaying.toFixed(2)}</span>
                  {/* Amount paying:<span className="total-money-right">${getCheckDishObjInOrderPrice}</span> */}
                </div>
                <div>
                  <span className="amount">Remaining Due:</span>
                  <span>${result.remainingDue.toFixed(2)}</span>
                </div>
                {/* <div>
                  Rounding Amount:<span>${result.price}</span>
                </div> */}
                <div>
                  <span className="amount">Amount paid:</span>
                  <span>${result.amountPaid.toFixed(2)}</span>
                  {/* Amount paid:<span>${paidPriceArr[paidPriceArr.length - 1] || 0}</span> */}
                </div>
              </div>
            </div>
          )}
          <div className="btn-group">
            <button
              onClick={() => {
                // console.log(history);
                history.goBack();
              }}>
              BACK
            </button>
            <button onClick={handleCancelPayment}>CANCEL PAYMENT</button>
            {/* <button>Add Dish</button> */}
            {/* {!cashierStatus && <button onClick={handlePayment}>PAY</button>} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(OrderList);
