import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Avatar, Badge } from "antd";
import { Redirect, Route, Switch } from "react-router-dom";
import CONSTANT from "../../configs/CONSTANT";

import Header from "../../components/Header";
// import UIMenu from "../../components/UIMenu";
import CashierPage from "./Cashier.js";
import DishPage from "./Dish.js";
import OrderList from "./OrderList";
import DishList from "./DishList";
import DishCategory from "./DishCategory";
import { useSelector, useDispatch } from "react-redux";

import { selectDishObjInOrder, setDishObjInOrder, setCurrentDish, selectCurrentDish, selectCashierStatus, setShowCashier } from "../../slices/dishSlice";

import { MenuOutlined, PrinterOutlined, FileTextFilled, CaretDownOutlined, QuestionCircleFilled, AntDesignOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
// import "./index.less";
import "./index.scss";
import CacheStorage from "../../lib/cache-storage";
import Cashier from "../Payment/Cashier";

const Order = (props) => {
  const cashierStatus = useSelector((state) => selectCashierStatus(state));
  const timerRef = useRef();

  const [showMore, setShowMore] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    // <div className="order-page-container">
    //   <main className="main">
    //     <OrderList></OrderList>
    //     {cashierStatus ? (
    //       <div className="right-container cashier">
    //         <Cashier />
    //       </div>
    //     ) : (
    //       <div className="right-container">
    //         <DishList></DishList>
    //         <DishCategory></DishCategory>
    //       </div>
    //     )}
    //   </main>
    // </div>
    <div className="order-page-container">
      <main className="main">
        <OrderList></OrderList>
        <Cashier></Cashier>
        {/* {cashierStatus ? (
            
            <Cashier />
          </div>
        ) : (
          <div className="right-container">
            <DishList></DishList>
            <DishCategory></DishCategory>
          </div>
        )} */}
      </main>
    </div>
  );
};

export default Order;
