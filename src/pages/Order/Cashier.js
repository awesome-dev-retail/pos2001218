import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";

import huangguan from "../../assets/images/huangguan.png";
import huangguanWhite from "../../assets/images/huangguan-white.png";
import weixin from "../../assets/images/weixin.png";
import deleteIcon from "../../assets/images/delete.png";
import zfb from "../../assets/images/zfb.png";
// import tag from "../../assets/images/tag.png";
// import free from "../../assets/images/free.png";
import banckCard from "../../assets/images/banck-card.png";
import { useSelector, useDispatch } from "react-redux";
import { selectDishObjInOrder, selectCashierStatus, setShowCashier } from "../../slices/dishSlice";

import "./Cashier.scss";
import { Input } from "antd";

const Cashier = (props) => {
  const [showCashPage, setShowCashPage] = useState(false);
  const [payMoney, setPayMoney] = useState(0);
  const [showCalcultor, setShowCalcultor] = useState(true);
  const [money, setMoney] = useState({});
  const dishObjFromSlice = useSelector((state) => selectDishObjInOrder(state));
  useEffect(() => {
    let price = 0,
      oldPrice = 0;
    dishObjFromSlice.forEach((item) => {
      price += (item.count || 1) * item.unit_price;
      oldPrice += (item.count || 1) * item.unit_cost;
    });
    setPayMoney(price);
    setMoney({ price, oldPrice });
  }, [dishObjFromSlice]);

  const discountList = [
    {
      id: "hyyh",
      name: "CASH",
      bgColor: "#35E783",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "CRETID CARD",
      bgColor: "#CB83FF",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "VOUCHER",
      bgColor: "#F80E3E",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "CRETID ACCOUNT",
      bgColor: "#A1D1F0",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "SPLIT PAYMENT",
      bgColor: "#FCBECE",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "REDEEM POINTS",
      bgColor: "#FDD441",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "GIFT CARD",
      bgColor: "#9600FF",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "OPTIONS",
      bgColor: "#98F8CA",
      icon: huangguan,
    },
  ];
  const calculatorNum = [
    { key: 1, value: 1 },
    { key: 2, value: 2 },
    { key: 3, value: 3 },
    { key: <img key="deleteIcon" src={deleteIcon} alt="deleteIcon" />, value: "delete" },
    { key: 4, value: 4 },
    { key: 5, value: 5 },
    { key: 6, value: 6 },
    { key: 10, value: 10 },
    { key: 7, value: 7 },
    { key: 8, value: 8 },
    { key: 9, value: 9 },
    { key: 20, value: 20 },
    { key: 0, value: 0 },
    { key: "00", value: "00" },
    { key: ".", value: "." },
    { key: 50, value: 50 },
  ];

  const handleClickCalculator = (value) => {
    if (value === "delete") {
      let copyPayMoney = payMoney.toString();
      if (copyPayMoney.length) {
        copyPayMoney = copyPayMoney.substr(0, copyPayMoney.length - 1);
        setPayMoney(parseFloat(copyPayMoney || 0));
      }
    } else {
      let copyPayMoney = payMoney.toString();
      copyPayMoney = copyPayMoney + value;
      setPayMoney(parseFloat(copyPayMoney));
    }
  };

  const handleClickOperation = (name) => {
    if (name === "CASH") {
      // console.log(name);
      setShowCashPage(true);
    } else if (name === "SPLIT PAYMENT") {
    }
  };
  return (
    <div className="cashier-container">
      {!showCashPage ? (
        <div>
          <div className="title">Amount Tendered</div>
          <div className="cashier-inner">
            <Input className="total-input" value={payMoney && payMoney.toFixed(2)} />
            <div className="cashier">
              {calculatorNum.map((item) => (
                <div onClick={() => handleClickCalculator(item.value)} className="calculator-item" key={item.value}>
                  {item.key}
                </div>
              ))}
            </div>
          </div>
          <div className="operation-list">
            {discountList.map((item) => (
              <div key={item.name} className="operation-item" style={{ background: item.bgColor }} onClick={() => handleClickOperation(item.name)}>
                <img src={item.icon} alt="icon" />
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="cash-page">
          <div className="title">Finalise Sale</div>
          <div className="cashier-inner">
            <div className="give-money-tip">Change required from:${payMoney}</div>
            <Input className="total-input" value={`$${(payMoney - money.price).toFixed(2)}`} />
            <div className="quick-operation-btn">
              <div>PRINT RECEIPT</div>
              <div>EMAIL RECEIPT</div>
            </div>
            <div className="complete-btn">COMPELETE SALE</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cashier;
