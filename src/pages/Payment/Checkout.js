import React, { Fragment } from "react";
import huangguan from "../../assets/images/huangguan.png";
import huangguanWhite from "../../assets/images/huangguan-white.png";
import weixin from "../../assets/images/weixin.png";
import zfb from "../../assets/images/zfb.png";
import banckCard from "../../assets/images/banck-card.png";

export default function Checkout() {
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
      icon: huangguan,
    },
    {
      id: "ddzd",
      name: "Customized",
      icon: huangguan,
    },
    // {
    //   id: "hh",
    //   name: "happy hour",
    //   icon: huangguan,
    // },
    // {
    //   id: "tqw",
    //   name: "soup75%",
    //   icon: huangguan,
    // },
  ];
  return (
    <Fragment>
      <div className="right-container cashier-container">
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
              <div>CASH</div>
              <div>
                <img src={zfb} alt="zfb" />
                <img src={weixin} alt="weixin" />
                BARCODE
              </div>
            </div>
            <div className="pay-way-other">
              <div className="pay-way-other-item">
                <div>
                  <img src={banckCard} alt="banckCard" />
                </div>
                <span>Band Card</span>
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
            <span>$90.2</span>
          </div>
          {/* <div className="line">
            <span className="label">Discount</span>
            <div>
              <span>-$4.8</span>
              <span className="show-more">Option</span>
            </div>
          </div> */}
          <div className="line">
            <span className="label">Fraction</span>
            <span>-$0.2</span>
          </div>
          <div className="line">
            <span className="label">Receivable</span>
            <span>$90</span>
          </div>
          <div className="line last-line">
            <span className="label">Received</span>
            <span className="choose-pay-way">Payment Method</span>
          </div>
          <div className="submit">CONFIRM CHECKOUT</div>
        </div>
      </div>
    </Fragment>
  );
}
