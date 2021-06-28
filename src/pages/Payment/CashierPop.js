import React, { useEffect, useMemo, useState, useRef } from "react";

import { withRouter } from "react-router";

import deleteIcon from "../../assets/images/delete.png";
import { useSelector, useDispatch, useStore } from "react-redux";
import { selectDishObjInOrder, selectCashierStatus, setShowCashier } from "../../slices/dishSlice";
import {
  selectAmountTotal,
  setPortionBillList,
  setShowCashierPop
} from "../../slices/documentSlice";

import { selectMessageBox, resetMessageBox, resetErrorBox } from "../../slices/publicComponentSlice";
import { savePayment, completePayment } from "../../slices/paymentSlice";
import { selectPayment, selectShowCashPage, setShowCashPage } from "../../slices/paymentSlice";

import { createPayment, createPaymentForSplit } from "../../services/createPayment";
import _ from "lodash";

import "./CashierPop.scss";
import { Input } from "antd";
import { message } from "../../lib";
import CacheStorage from "../../lib/cache-storage";
import CONSTANT from "../../configs/CONSTANT";
import { history } from "../../components/MyRouter";
import { fetchDevices, selectDevice, setDevice } from "../../slices/authSlice";
import Document from "../../modules/document";
import { sleep } from "../../lib/index";

const CashierPop = (props) => {
  const [payMoney, setPayMoney] = useState(0);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);


  const calculatorLeftNum = [
    { key: 1, value: 1 },
    { key: 2, value: 2 },
    { key: 3, value: 3 },
    { key: 4, value: 4 },
    { key: 5, value: 5 },
    { key: 6, value: 6 },
    { key: 7, value: 7 },
    { key: 8, value: 8 },
    { key: 9, value: 9 },
    { key: 0, value: 0 },
    { key: "00", value: "00" },
    { key: ".", value: "." },
  ];

  const calculatorRightNum = [
    { key: <img key="deleteIcon" src={deleteIcon} alt="deleteIcon" />, value: "delete" },
    { key: "RESET", value: "RESET" },
    { key: "DONE", value: "DONE" },
  ];
  const amountTotal = useSelector((state) => selectAmountTotal(state)) || 0;
  const handleClickCalculator = (value) => {
    if (value === "delete") {
      if (currentIndex === 0) {
        let copyPayMoney = payMoney.toString();
        if (copyPayMoney.length) {
          copyPayMoney = copyPayMoney.substr(0, copyPayMoney.length - 1);
          setPayMoney(copyPayMoney || 0);
        }
      } else {
        let copyCount = count.toString();
        if (copyCount.length) {
          copyCount = copyCount.substr(0, copyCount.length - 1);
          setCount(copyCount || 1);
        }
      }
    } else if (value === "RESET") {
      if (currentIndex) {
        setCount(1);
      } else {
        setPayMoney(amountTotal);
      }
    } else if (value === "DONE") {
      let list = [];
      if (currentIndex) {
        let _count = parseInt(count);
        let avgPriceArr = new Array(_count).fill((amountTotal / _count).toFixed(2));
        avgPriceArr.forEach((item, index) => {
          list.push({
            id: index,
            checked: false,
            description: "Portion Payment",
            line_amount: Number(item)
          });
        });
      } else {
        let money = amountTotal - payMoney;
        if (money === amountTotal) {
          return;
        }
        list.push({
          id: 1,
          checked: false,
          description: "Portion Payment",
          line_amount: Number(payMoney)
        });
        list = [{
          id: 1,
          checked: false,
          description: "Portion Payment",
          line_amount: Number(payMoney)
        },
        {
          id: 12,
          checked: false,
          description: "Portion Payment",
          line_amount: money
        }];
      }
      dispatch(setPortionBillList(list));
      dispatch(setShowCashierPop(false));
    } else {
      if (currentIndex === 0) {
        let copyPayMoney = payMoney.toString();
        copyPayMoney = copyPayMoney + value;
        copyPayMoney = copyPayMoney[0] == "0" && copyPayMoney >= 1 ? copyPayMoney.substr(1) : copyPayMoney;
        setPayMoney(copyPayMoney);
      } else {
        let copyCount = count.toString();
        copyCount = copyCount + value;
        copyCount = copyCount[0] == "0" && copyCount >= 1 ? copyCount.substr(1) : copyCount;
        setCount(copyCount);
      }
    }
  };

  const handleSetTab = index => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };
  useEffect(() => {
    setPayMoney(amountTotal);
  }, []);

  return (
    <div className="cashier-pop">
      <div className="triangle"></div>
      <div className="cashier-inner">
        <h2 className="pop-title">Splitting ${amountTotal}</h2>
        <div className="cashier-innner-tab">
          {["AMOUNT", "EQUALLY"].map((item, index) => (
            <div onClick={() => handleSetTab(index)} key={item} className={currentIndex === index ? "active" : ""}>{item}</div>
          ))}
        </div>
        {currentIndex === 0 ? <Input className="total-input" defaultValue={0} value={`$${payMoney}`} /> :
          <Input className="total-input" value={count} />}
        <div className="cashier">
          <div className="cashier-left">
            {calculatorLeftNum.map((item) => (
              <div onClick={() => handleClickCalculator(item.value)} className="calculator-item" key={item.value}>
                {item.key}
              </div>
            ))}
          </div>
          <div className="cashier-right">
            {calculatorRightNum.map((item) => (
              <div onClick={() => handleClickCalculator(item.value)} className="calculator-item" key={item.value}>
                {item.key}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default withRouter(CashierPop);
