import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Avatar, Badge } from "antd";

import Header from "../../components/Header";
// import UIMenu from "../../components/UIMenu";
import Cashier from "./Cashier.js";
import OrderList from "./OrderList";
import DishList from "./DishList";
import DishCategory from "./DishCategory";
import { useSelector, useDispatch } from "react-redux";

import { selectDishObjInOrder, setDishObjInOrder, setCurrentDish, selectCurrentDish, selectCashierStatus, setShowCashier } from "../../slices/dishSlice";

import { MenuOutlined, PrinterOutlined, FileTextFilled, CaretDownOutlined, QuestionCircleFilled, AntDesignOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
// import "./index.less";
import "./index.scss";

const Order = (props) => {
  const cashierStatus = useSelector((state) => selectCashierStatus(state));
  // console.log("orderpage");
  const timerRef = useRef();
  // const [tableList, setTableList] = useState(tableListData)
  // const [time, setCurrentTime] = useState()
  // const [date, setCurrentDate] = useState()
  // const [week, setCurrentWeek] = useState()
  // const [showTableInfo, setShowTableInfo] = useState(false)
  const [showMore, setShowMore] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // eslint-disable-next-line react/prop-types
  // console.log("props.match.params", props.match.params);

  // useEffect(() => {
  //   setCurrentDate(moment().format('MM月DD日'))
  //   setCurrentWeek(weeks[moment().day()])
  //   timerRef.current = setInterval(() => {
  //     setCurrentTime(moment().format('HH:mm:ss'))
  //   }, 1000)
  //   return () => {
  //     clearInterval(timerRef.current)
  //   }
  // }, [])

  // const getClass = (type) => {
  //   return type === 'eating' ? 'eating' : type === 'waitPlanOrder' ? 'wait-plan-order' : 'empty'
  // }

  return (
    <div className="order-page-container">
      <main className="main">
        <OrderList></OrderList>
        {cashierStatus ? (
          <div className="right-container cashier">
            <Cashier />
          </div>
        ) : (
          <div className="right-container">
            <DishList></DishList>
            <DishCategory></DishCategory>
          </div>
        )}
      </main>
    </div>
  );
};

export default Order;
