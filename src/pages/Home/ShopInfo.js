import React, { useEffect, useState, useRef } from "react";
import { selectTableList } from "../../slices/tableSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

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
    // timerRef.current = setInterval(() => {
    //   setCurrentTime(moment().format("HH:mm:ss"));
    // }, 1000);
    return () => {
      // clearInterval(timerRef.current);
    };
  }, []);
  useEffect(() => {
    let unpaidOrder = 0;
    let unpaidAmount = 0;
    tableListFromSlice.map((item) => {
      if (item.status === "Occupied") {
        unpaidOrder += 1;
        unpaidAmount += item.GrossAmount;
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
      <div>Skytower 1291928129012012</div>
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
