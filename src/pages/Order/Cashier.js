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
      name: "VIP",
      // name: "会员优惠",
      icon: huangguan,
    },
    {
      id: "md",
      name: "Free",
      // name: "免单",
      icon: huangguan,
    },
    {
      id: "ddzd",
      name: "Customized",
      // name: "订单自定",
      icon: huangguan,
    },
    // {
    //   id: "hh",
    //   name: "happy hour",
    //   icon: huangguan,
    // },
    // {
    //   id: "tqw",
    //   name: "汤75%",
    //   icon: huangguan,
    // },
  ];
  const calculatorNum = [
    { key: 1, value: 1 },
    { key: 2, value: 2 },
    { key: 3, value: 3 },
    { key: 4, value: 4 },
    { key: 5, value: 5 },
    { key: 6, value: 6 },
    { key: 7, value: 7 },
    { key: 8, value: 8 },
    { key: 9, value: 9 },
    { key: ".", value: "." },
    { key: 0, value: 0 },
    { key: "00", value: "00" },
  ];
  const calcultorOptions = [
    { key: <DownOutlined key="DownOutlined" />, value: "hide" },
    { key: <img key="deleteIcon" src={deleteIcon} alt="deleteIcon" />, value: "delete" },
    { key: "CLEAR", value: "clear" },
  ];
  const handlePayCash = () => {
    console.log(1);
  };
  const quickSetPayMoney = (money) => {
    setPayMoney(money);
  };

  const handleClickCalculator = (value) => {
    console.log(value);
    if (value === "hide") {
      setShowCalcultor(false);
    } else if (value === "clear") {
      setPayMoney("");
    } else if (value === "delete") {
      let copyPayMoney = payMoney.toString();
      if (copyPayMoney.length) {
        copyPayMoney = copyPayMoney.substr(0, copyPayMoney.length - 1);
        setPayMoney(parseFloat(copyPayMoney));
      }
    } else {
      let copyPayMoney = payMoney.toString();
      copyPayMoney = copyPayMoney + value;
      setPayMoney(parseFloat(copyPayMoney));
    }
  };
  return (
    <div className="cashier-container">
      <div className="cashier-container-left">
        <div className="title">CONCESSION</div>
        <div className="discount-way-list">
          {discountList.map((item) => (
            <div className="discount-way-item" key={item.id}>
              <img src={item.icon} alt="icon" />
              <span>{item.name}</span>
            </div>
          ))}
          <div className="discount-way-item"></div>
        </div>
        <div className="title">PAYMENT</div>
        <div className="pay-way-container">
          <div className="pay-way">
            <div onClick={handlePayCash}>CASH</div>
            <div>
              <img src={zfb} alt="zfb" />
              <img src={weixin} alt="weixin" />
              SCAN
            </div>
          </div>
          <div className="pay-way-other">
            <div className="pay-way-other-item">
              <div>
                <img src={banckCard} alt="banckCard" />
              </div>
              <span>Bank Card</span>
            </div>
            <div className="pay-way-other-item">
              <div>
                <img src={huangguanWhite} alt="banckCard" />
              </div>
              <span>Valued Card</span>
            </div>
            <div className="pay-way-other-item">
              <div></div>
              <span>Others</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cashier-container-right">
        <div className="title">BILL</div>
        <div className="line">
          <span className="label">Price</span>
          <span>${money.oldPrice}</span>
        </div>
        <div className="line">
          <span className="label">Discount</span>
          <div>
            <span>-${(money.oldPrice - money.price).toFixed(2)}</span>
            {/* <span className="show-more">展开</span> */}
          </div>
        </div>
        <div className="line">
          <span className="label">Fraction</span>
          <span>-$0.0</span>
        </div>
        <div className="line">
          <span className="label">Receivable</span>
          <span>${money.price && money.price.toFixed(2)}</span>
        </div>
        {/* <div className="line">
          <span className="label">实收</span>
          <span className="choose-pay-way">选择支付方式</span>
        </div> */}
        <div className="line last-line">
          <span className="label">Cash</span>
          <Input className="input-money" value={payMoney && payMoney.toFixed(2)} onClick={() => setShowCalcultor(true)} />
          {/* <span>撤销</span> */}
        </div>
        <div className="line">
          <span className="label">{payMoney && payMoney - money.oldPrice > 0 ? "Change" : "To be paid"}</span>
          <span className="give-money">{(payMoney - money.price).toFixed(2)}</span>
        </div>
        <div className="calculator-container">
          <div className="quick-input">
            {[50, 100].map((item) => (
              <div onClick={() => quickSetPayMoney(item)} key={item}>
                ￥{item}
              </div>
            ))}
          </div>
          {showCalcultor && (
            <div className="calculator">
              <div className="calculator-left">
                {calculatorNum.map((item) => (
                  <div onClick={() => handleClickCalculator(item.value)} className="calculator-item" key={item.value}>
                    {item.key}
                  </div>
                ))}
              </div>
              <div className="calculator-right">
                {calcultorOptions.map((item) => (
                  <div onClick={() => handleClickCalculator(item.value)} className="calculator-item" key={item.value}>
                    {item.key}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="submit">CONFIRM TO CHECKOUT</div>
      </div>
    </div>
  );
};

export default Cashier;
