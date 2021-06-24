import React, { useEffect, useState, useRef } from "react";
import { selectTableList } from "../../slices/tableSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import CacheStorage from "../../lib/cache-storage";

const ShopInfo = () => {
  const timerRef = useRef();

  const [time, setCurrentTime] = useState();
  const [date, setCurrentDate] = useState();
  const [week, setCurrentWeek] = useState();
  const [unpaidOrder, setUnpaidOrder] = useState(0);
  const [unpaidAmount, setUnpaidAmount] = useState(0);

  const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const tableListFromSlice = useSelector((state) => selectTableList(state));
  useEffect(() => {
    setCurrentDate(moment().format("YYYY-MM-DD"));
    setCurrentWeek(weeks[moment().day()]);
  }, []);

  useEffect(() => {
    let unpaidOrder = 0;
    let unpaidAmount = 0;
    tableListFromSlice.forEach((item) => {
      if (item.status === "Occupied") {
        unpaidOrder += 1;
        const invoice = CacheStorage.getItem("invoice_" + "1_" + item.id);
        if (invoice && invoice.GrossAmount) {
          unpaidAmount += invoice.GrossAmount;
        } else {
          unpaidAmount = 0;
        }
        // unpaidAmount += item.totalAmount;
      }
    });
    setUnpaidOrder(unpaidOrder);
    setUnpaidAmount(unpaidAmount);
  }, [tableListFromSlice]);

  return (
    <div className="statistics">
      {/* <h1>{time}</h1> */}
      <div className="week">
        {date} {week}
      </div>
      <div>BizCafe 1291928129012012</div>
      <div className="statistics-inner">
        <div>
          <span>Unpaid Order</span>
          <h2>{unpaidOrder}</h2>
        </div>
        <div>
          <span>Unpaid Amount ($)</span>
          <h2>{unpaidAmount.toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
