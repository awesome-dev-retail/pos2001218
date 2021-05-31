import React, { useEffect, useMemo, useState } from "react";

import { withRouter } from "react-router";

import { DownOutlined } from "@ant-design/icons";

import huangguan from "../../assets/images/huangguan.png";
import huangguanWhite from "../../assets/images/huangguan-white.png";
import weixin from "../../assets/images/weixin.png";
import deleteIcon from "../../assets/images/delete.png";
import zfb from "../../assets/images/zfb.png";
// import tag from "../../assets/images/tag.png";
// import free from "../../assets/images/free.png";
import banckCard from "../../assets/images/banck-card.png";
import { useSelector, useDispatch, useStore } from "react-redux";
import { selectDishObjInOrder, selectCashierStatus, setShowCashier } from "../../slices/dishSlice";
import {
  fetchDocument,
  processEFTPOS,
  selectDocument,
  selectDocumentIsLoading,
  resetAll,
  setBillList,
  selectShowSplitOrder,
  setShowSplitOrder,
  setPaidPriceArr,
  selectPaidPriceArr,
  setDocument,
} from "../../slices/documentSlice";
import { selectMessageBox, resetMessageBox, resetErrorBox } from "../../slices/publicComponentSlice";
import { savePayment, completePayment } from "../../slices/paymentSlice";
import { selectPayment } from "../../slices/paymentSlice";

import { createPayment } from "../../services/createPayment";
import _ from "lodash";

import "./Cashier.scss";
import { Input } from "antd";
import { message } from "../../lib";
import CacheStorage from "../../lib/cache-storage";
import CONSTANT from "../../configs/CONSTANT";
import { history } from "../../components/MyRouter";
import { fetchDevices, selectDevice, setDevice } from "../../slices/authSlice";
import Document from "../../modules/document";
import { sleep } from "../../lib/index";

const Cashier = (props) => {
  const [showCashPage, setShowCashPage] = useState(false);
  const [payMoney, setPayMoney] = useState(0);
  const [showCalcultor, setShowCalcultor] = useState(true);
  const [money, setMoney] = useState({});
  const documentFromSlice = useSelector((state) => selectDocument(state)) || {};
  const paymentFromSlice = useSelector((state) => selectPayment(state)) || {};
  const dispatch = useDispatch();
  const store = useStore();
  const messageBox = useSelector((state) => selectMessageBox(state));
  const isLoading = useSelector((state) => selectDocumentIsLoading(state));
  const showSplitOrder = useSelector((state) => selectShowSplitOrder(state));
  const paidPriceArr = useSelector((state) => selectPaidPriceArr(state));

  const billList = JSON.parse(JSON.stringify(documentFromSlice.invoice_lines || [])) || [];

  const localDocument = CacheStorage.getItem(CONSTANT.LOCALSTORAGE_SYMBOL.DOCUMENT_SYMBOL);
  const device = useSelector((state) => selectDevice(state));

  //todo: hard coding below to replace it whenever device setting page is ready
  const localDevice = CacheStorage.getItem(CONSTANT.LOCALSTORAGE_SYMBOL.DEVICE_SYMBOL);

  useEffect(() => {
    initialDoc();

    return () => {
      // dispatch(resetMessageBox());
      dispatch(resetErrorBox());
    };
  }, []);

  const initialDoc = async () => {
    // eslint-disable-next-line react/prop-types
    const pathname = props.location.pathname + "";
    const invoiceID = pathname.split("/")[3] * 1;

    //todo: hard coding below to replace it whenever device setting page is ready
    if (localDevice) {
      dispatch(setDevice(localDevice));
    } else if (_.isEmpty(device)) {
      await dispatch(fetchDevices());
    }

    console.log(document);
    if (localDocument) {
      console.log("document build from local...");
      console.log(localDocument);

      dispatch(setDocument(new Document(localDocument)));
      if (localDocument.transactionId) {
        await sleep(100);
        await processEFTPOSTransaction();
      }
    } else {
      console.log("Document build from cloud...");
      await dispatch(fetchDocument(invoiceID));
    }
  };

  // useEffect(() => {
  //   let price = 0,
  //     oldPrice = 0;
  //   dishObjFromSlice.forEach((item) => {
  //     price += (item.count || 1) * item.unit_price;
  //     oldPrice += (item.count || 1) * item.unit_cost;
  //   });
  //   setPayMoney(price);
  //   setMoney({ price, oldPrice });
  // }, [dishObjFromSlice]);

  const discountList = [
    {
      id: "hyyh",
      name: "CASH",
      bgColor: "#35E783",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "EFT-POS",
      bgColor: "#CB83FF",
      icon: huangguan,
    },
    // {
    //   id: "hyyh",
    //   name: "VOUCHER",
    //   bgColor: "#F80E3E",
    //   icon: huangguan,
    // },
    // {
    //   id: "hyyh",
    //   name: "CRETID ACCOUNT",
    //   bgColor: "#A1D1F0",
    //   icon: huangguan,
    // },
    {
      id: "hyyh",
      name: "SPLIT PAYMENT",
      bgColor: "#FCBECE",
      icon: huangguan,
    },
    {
      id: "hyyh",
      name: "CASH OUT",
      bgColor: "#FDD441",
      icon: huangguan,
    },
    // {
    //   id: "hyyh",
    //   name: "GIFT CARD",
    //   bgColor: "#9600FF",
    //   icon: huangguan,
    // },
    // {
    //   id: "hyyh",
    //   name: "OPTIONS",
    //   bgColor: "#98F8CA",
    //   icon: huangguan,
    // },
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
      if (result.amount > payMoney) {
        message.warning("Tendered must be greater than due!");
        return;
      }
      const copyDocument = JSON.parse(JSON.stringify(documentFromSlice));
      const payment = createPayment(copyDocument, payMoney);
      dispatch(savePayment(payment));
      setShowCashPage(true);
      // let paidPrice = 0;
      // let notPaidOrder = billList.filter((i) => {
      //   if (i.checked) {
      //     paidPrice += i.line_amount;
      //   }
      //   return i.checked !== true;
      // });
      // let tempPaidPriceArr = [...paidPriceArr];
      // tempPaidPriceArr.push(paidPrice);
      // dispatch(setBillList(notPaidOrder));
      // dispatch(setPaidPriceArr(tempPaidPriceArr));
      // setShowCashPage(true);
    } else if (name === "SPLIT PAYMENT") {
      dispatch(setShowSplitOrder(true));
    } else if (name === "EFT-POS") {
      // console.log(document);
      processEFTPOSTransaction();
      // let initMessageBox = {
      //   title: "EFTPOS PROCESS",
      //   contentList: ["PLEASE WAIT", "CONNECTING EFTPOS PROVIDER SERVER"],
      //   btnList: [
      //   ],
      //   processing: "Connecting",
      //   visible: true,
      // };
      // dispatch(setMessageBox(initMessageBox));
    }
  };

  const processEFTPOSTransaction = () => {
    if (!isLoading) {
      dispatch(processEFTPOS({ amount: payMoney, cashOutAmount: 0 }));
      // Save temp payment
      // Invoke
      // Socket
    }
  };

  const handleDevBtnClick = () => {
    console.log(store.getState());
    dispatch(resetAll());
  };

  const handleCompletePayment = () => {
    // setShowCashPage(false);

    // eslint-disable-next-line react/prop-types
    const invoiceId = props.match.params.invoiceId;
    const tableId = documentFromSlice.table_id;
    dispatch(completePayment({ invoiceId, tableId }));
  };

  const result = useMemo(() => {
    const amountInDoc = documentFromSlice.doc_gross_amount;
    const amount = amountInDoc ? amountInDoc.toFixed(2) : "0.00";
    let change = (payMoney - (amountInDoc ? amountInDoc.toFixed(1) : 0)).toFixed(1);
    change = change < 0 ? 0 : change;
    return { amount, change };
  }, [documentFromSlice, payMoney]);

  return (
    <div className="right-container cashier">
      <div className="cashier-container">
        {!showCashPage ? (
          <div>
            {/* <div className="title">Amount Tendered</div>   */}
            <div className="cashier-inner">
              <div className="title">Amount Due:</div>
              <Input className="total-input" value={result.amount} />
              <div className="title">Amount Tendered:</div>
              <Input className="total-input" value={payMoney && payMoney.toFixed(1)} />
              <div className="title">Changes:</div>
              <Input className="total-input" value={result.change} />
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
            {/*<button onClick={handleDevBtnClick}>Dev</button>*/}
          </div>
        ) : (
          <div className="cash-page">
            <div className="title">Finalise Sale</div>
            <div className="cashier-inner">
              <div className="give-money-tip">PAYMENT ACCEPTED</div>
              {/* <div className="give-money-tip">Change required from:${documentFromSlice.doc_gross_amount ? (documentFromSlice.doc_gross_amount.toFixed(1) * 1).toFixed(2) : 0}</div> */}
              {/* <Input className="total-input" value={paymentFromSlice ? paymentFromSlice.Change : ""} /> */}
              {/* <Input className="total-input" value={`$${(payMoney - money.price).toFixed(2)}`} /> */}
              <div className="quick-operation-btn">
                <div>PRINT RECEIPT</div>
                <div>EMAIL RECEIPT</div>
              </div>
              <div className="complete-btn" onClick={handleCompletePayment}>
                COMPELETE SALE
              </div>
              {/* <div className="complete-btn" onClick={() => setShowCashPage(false)}>
                COMPELETE SALE
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(Cashier);
